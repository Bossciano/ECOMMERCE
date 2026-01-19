import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck, Check, Lock, Shield, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { z } from "zod";

const shippingSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(20),
  address: z.string().trim().min(5, "Address is required").max(200),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  zipCode: z.string().trim().min(4, "ZIP code is required").max(20),
  country: z.string().trim().min(2, "Country is required").max(100),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const shippingCost = 10.00;
  const total = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        `}</style>
        <div style={{ background: 'linear-gradient(180deg, #FAF9F6 0%, #FFFFFF 50%, #F7E7CE 100%)', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1, padding: '4rem 1rem', textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h1 style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '2rem', color: '#1A1A1A', marginBottom: '1rem' }}>
                Your cart is empty
              </h1>
              <Button onClick={() => navigate("/")}>Continue Shopping</Button>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateShipping = () => {
    try {
      shippingSchema.parse(shippingInfo);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof ShippingFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleContinueToPayment = () => {
    if (validateShipping()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContinueToReview = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        customer_name: shippingInfo.fullName,
        customer_email: shippingInfo.email,
        customer_phone: shippingInfo.phone,
        shipping_address: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totalPrice,
        shipping_cost: shippingCost,
        total: total,
        payment_method: paymentMethod,
        status: "pending",
      };

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke("send-order-confirmation", {
        body: {
          orderId: order.id,
          customerEmail: shippingInfo.email,
          customerName: shippingInfo.fullName,
          items: items,
          total: total,
          shippingAddress: orderData.shipping_address,
        },
      });

      if (emailError) {
        console.error("Email error:", emailError);
      }

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
      
      toast({
        title: "Order placed successfully!",
        description: "You will receive a confirmation email shortly.",
      });
    } catch (error: any) {
      console.error("Order error:", error);
      toast({
        title: "Order failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        :root {
          --gold: #D4AF37;
          --gold-light: #F4E4C1;
          --gold-dark: #B8941F;
          --charcoal: #1A1A1A;
          --charcoal-light: #2D2D2D;
          --ivory: #FFFFF0;
          --cream: #FAF9F6;
          --champagne: #F7E7CE;
          --white: #FFFFFF;
        }

        .checkout-page {
          background: linear-gradient(180deg, var(--cream) 0%, var(--white) 50%, var(--champagne) 100%);
          font-family: 'Montserrat', sans-serif;
          min-height: 100vh;
        }

        .checkout-header {
          background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
          border-bottom: 2px solid var(--champagne);
          padding: 2rem 0 1.5rem;
          margin-bottom: 3rem;
        }

        .checkout-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 2rem;
          position: relative;
          display: inline-block;
        }

        .checkout-title::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100px;
          height: 3px;
          background: linear-gradient(90deg, var(--gold) 0%, var(--champagne) 100%);
          border-radius: 2px;
        }

        .back-button {
          background: transparent;
          border: 2px solid var(--champagne);
          color: var(--charcoal);
          padding: 0.75rem 1.5rem;
          border-radius: 0.625rem;
          font-weight: 600;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }

        .back-button:hover {
          background: var(--champagne);
          border-color: var(--gold);
          transform: translateX(-4px);
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .progress-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .progress-circle {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.125rem;
          transition: all 0.3s ease;
          border: 3px solid var(--champagne);
          background: var(--white);
          color: var(--charcoal-light);
        }

        .progress-circle.active {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          border-color: var(--gold);
          color: var(--charcoal);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
        }

        .progress-circle.completed {
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          border-color: var(--charcoal);
          color: var(--gold);
        }

        .progress-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--charcoal-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .progress-label.active {
          color: var(--gold-dark);
        }

        .progress-line {
          flex: 1;
          height: 3px;
          background: var(--champagne);
          border-radius: 2px;
          position: relative;
          overflow: hidden;
        }

        .progress-line.completed {
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%);
        }

        .section-card {
          background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
          border: 2px solid var(--champagne);
          border-radius: 1.25rem;
          padding: 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.1);
          animation: fade-slide-up 0.5s ease-out;
        }

        @keyframes fade-slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 2px solid var(--champagne);
        }

        .section-icon {
          width: 2.5rem;
          height: 2.5rem;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gold-dark);
        }

        .section-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--charcoal);
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 0.5rem;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1.125rem;
          border: 2px solid var(--champagne);
          background: var(--white);
          border-radius: 0.625rem;
          font-size: 0.9375rem;
          color: var(--charcoal);
          font-weight: 500;
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--gold);
          background: var(--cream);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }

        .form-input.error {
          border-color: var(--charcoal);
        }

        .error-message {
          font-size: 0.8125rem;
          color: var(--charcoal);
          margin-top: 0.375rem;
          font-weight: 500;
        }

        .payment-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border: 2px solid var(--champagne);
          background: var(--white);
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }

        .payment-option:hover {
          background: var(--champagne);
          border-color: var(--gold-light);
        }

        .payment-option.selected {
          border-color: var(--gold);
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
        }

        .continue-button {
          width: 100%;
          background: linear-gradient(135deg, var(--charcoal) 0%, var(--charcoal-light) 100%);
          color: var(--ivory);
          border: none;
          padding: 1.125rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(26, 26, 26, 0.25);
          margin-top: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .continue-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .continue-button:hover::before {
          opacity: 1;
        }

        .continue-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(26, 26, 26, 0.35);
        }

        .continue-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .continue-button:disabled:hover {
          transform: none;
        }

        .continue-button span {
          position: relative;
          z-index: 1;
        }

        .order-summary-card {
          background: linear-gradient(135deg, var(--white) 0%, var(--cream) 100%);
          border: 2px solid var(--gold);
          border-radius: 1.25rem;
          padding: 2rem;
          position: sticky;
          top: 7rem;
          box-shadow: 0 12px 40px rgba(212, 175, 55, 0.2);
        }

        .summary-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 1.5rem;
          text-align: center;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--champagne);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--charcoal-light);
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 0.9375rem;
        }

        .summary-value {
          color: var(--charcoal);
          font-weight: 600;
        }

        .summary-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          margin: 1.5rem 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Libre Baskerville', serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 1.5rem;
        }

        .summary-total-value {
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .summary-info {
          background: var(--champagne);
          padding: 1.25rem;
          border-radius: 0.75rem;
          text-align: center;
          margin-top: 1.5rem;
          border: 1px solid var(--gold-light);
        }

        .summary-info-text {
          font-size: 0.875rem;
          color: var(--charcoal-light);
          font-weight: 600;
        }

        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          padding: 0.875rem;
          background: linear-gradient(135deg, var(--gold-light) 0%, var(--champagne) 100%);
          border-radius: 0.625rem;
          border: 1px solid var(--gold);
        }

        .secure-badge-icon {
          color: var(--gold-dark);
        }

        .secure-badge-text {
          color: var(--charcoal);
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .review-section {
          background: var(--white);
          padding: 1.5rem;
          border-radius: 0.75rem;
          border: 2px solid var(--champagne);
          margin-bottom: 1.5rem;
        }

        .review-section-title {
          font-weight: 700;
          color: var(--charcoal);
          margin-bottom: 1rem;
          font-size: 1.125rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .review-text {
          color: var(--charcoal-light);
          font-size: 0.9375rem;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: var(--cream);
          border-radius: 0.625rem;
          border: 1px solid var(--champagne);
        }

        .order-item-image {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 0.5rem;
          border: 2px solid var(--champagne);
        }

        .order-item-name {
          font-weight: 600;
          color: var(--charcoal);
          margin-bottom: 0.25rem;
        }

        .order-item-qty {
          font-size: 0.875rem;
          color: var(--charcoal-light);
        }

        .order-item-price {
          font-weight: 700;
          color: var(--gold-dark);
          font-family: 'Libre Baskerville', serif;
        }

        @media (max-width: 768px) {
          .checkout-title {
            font-size: 2rem;
          }

          .section-card {
            padding: 1.5rem;
          }

          .progress-container {
            flex-direction: column;
            gap: 0.5rem;
          }

          .progress-line {
            display: none;
          }

          .order-summary-card {
            position: static;
          }
        }
      `}</style>

      <div className="checkout-page">
        <Navbar />
        
        <div className="checkout-header">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => currentStep === 1 ? navigate("/cart") : setCurrentStep(currentStep - 1)}
                className="back-button"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                <span>Back</span>
              </button>

              <h1 className="checkout-title">Secure Checkout</h1>

              {/* Progress Indicator */}
              <div className="progress-container">
                <div className="progress-step">
                  <div className={`progress-circle ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                    {currentStep > 1 ? <Check className="h-5 w-5" strokeWidth={2.5} /> : '1'}
                  </div>
                  <span className={`progress-label ${currentStep === 1 ? 'active' : ''}`}>Shipping</span>
                </div>

                <div className={`progress-line ${currentStep > 1 ? 'completed' : ''}`} />

                <div className="progress-step">
                  <div className={`progress-circle ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                    {currentStep > 2 ? <Check className="h-5 w-5" strokeWidth={2.5} /> : '2'}
                  </div>
                  <span className={`progress-label ${currentStep === 2 ? 'active' : ''}`}>Payment</span>
                </div>

                <div className={`progress-line ${currentStep > 2 ? 'completed' : ''}`} />

                <div className="progress-step">
                  <div className={`progress-circle ${currentStep >= 3 ? 'active' : ''}`}>
                    3
                  </div>
                  <span className={`progress-label ${currentStep === 3 ? 'active' : ''}`}>Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <div className="section-card">
                    <div className="section-header">
                      <div className="section-icon">
                        <Truck className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <h2 className="section-title">Shipping Information</h2>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label" htmlFor="fullName">
                            Full Name
                          </label>
                          <input
                            id="fullName"
                            name="fullName"
                            value={shippingInfo.fullName}
                            onChange={handleInputChange}
                            className={`form-input ${errors.fullName ? 'error' : ''}`}
                            placeholder="John Doe"
                          />
                          {errors.fullName && (
                            <p className="error-message">{errors.fullName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="form-label" htmlFor="email">
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={handleInputChange}
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="john@example.com"
                          />
                          {errors.email && (
                            <p className="error-message">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="form-label" htmlFor="phone">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={handleInputChange}
                          className={`form-input ${errors.phone ? 'error' : ''}`}
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                          <p className="error-message">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="form-label" htmlFor="address">
                          Street Address
                        </label>
                        <input
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleInputChange}
                          className={`form-input ${errors.address ? 'error' : ''}`}
                          placeholder="123 Main Street"
                        />
                        {errors.address && (
                          <p className="error-message">{errors.address}</p>
                        )}
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label" htmlFor="city">
                            City
                          </label>
                          <input
                            id="city"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleInputChange}
                            className={`form-input ${errors.city ? 'error' : ''}`}
                            placeholder="New York"
                          />
                          {errors.city && (
                            <p className="error-message">{errors.city}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="form-label" htmlFor="state">
                            State/Province
                          </label>
                          <input
                            id="state"
                            name="state"
                            value={shippingInfo.state}
                            onChange={handleInputChange}
                            className={`form-input ${errors.state ? 'error' : ''}`}
                            placeholder="NY"
                          />
                          {errors.state && (
                            <p className="error-message">{errors.state}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="form-label" htmlFor="zipCode">
                            ZIP / Postal Code
                          </label>
                          <input
                            id="zipCode"
                            name="zipCode"
                            value={shippingInfo.zipCode}
                            onChange={handleInputChange}
                            className={`form-input ${errors.zipCode ? 'error' : ''}`}
                            placeholder="10001"
                          />
                          {errors.zipCode && (
                            <p className="error-message">{errors.zipCode}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="form-label" htmlFor="country">
                            Country
                          </label>
                          <input
                            id="country"
                            name="country"
                            value={shippingInfo.country}
                            onChange={handleInputChange}
                            className={`form-input ${errors.country ? 'error' : ''}`}
                            placeholder="United States"
                          />
                          {errors.country && (
                            <p className="error-message">{errors.country}</p>
                          )}
                        </div>
                      </div>

                      <button onClick={handleContinueToPayment} className="continue-button">
                        <span>Continue to Payment</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Method */}
                {currentStep === 2 && (
                  <div className="section-card">
                    <div className="section-header">
                      <div className="section-icon">
                        <CreditCard className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <h2 className="section-title">Payment Method</h2>
                    </div>
                    
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div>
                        <div 
                          className={`payment-option ${paymentMethod === 'credit-card' ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod('credit-card')}
                        >
                          <RadioGroupItem value="credit-card" id="credit-card" />
                          <Label htmlFor="credit-card" style={{ flex: 1, cursor: 'pointer', fontWeight: 600 }}>
                            Credit / Debit Card
                          </Label>
                        </div>
                        
                        <div 
                          className={`payment-option ${paymentMethod === 'paypal' ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod('paypal')}
                        >
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Label htmlFor="paypal" style={{ flex: 1, cursor: 'pointer', fontWeight: 600 }}>
                            PayPal
                          </Label>
                        </div>
                        
                        <div 
                          className={`payment-option ${paymentMethod === 'cash-on-delivery' ? 'selected' : ''}`}
                          onClick={() => setPaymentMethod('cash-on-delivery')}
                        >
                          <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                          <Label htmlFor="cash-on-delivery" style={{ flex: 1, cursor: 'pointer', fontWeight: 600 }}>
                            Cash on Delivery
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    <button onClick={handleContinueToReview} className="continue-button">
                      <span>Continue to Review</span>
                    </button>
                  </div>
                )}

                {/* Step 3: Order Review */}
                {currentStep === 3 && (
                  <div>
                    <div className="section-card">
                      <div className="section-header">
                        <div className="section-icon">
                          <Check className="h-5 w-5" strokeWidth={1.5} />
                        </div>
                        <h2 className="section-title">Review Your Order</h2>
                      </div>
                      
                      <div className="review-section">
                        <h3 className="review-section-title">Shipping Address</h3>
                        <p className="review-text">{shippingInfo.fullName}</p>
                        <p className="review-text">{shippingInfo.address}</p>
                        <p className="review-text">
                          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                        </p>
                        <p className="review-text">{shippingInfo.country}</p>
                        <p className="review-text" style={{ marginTop: '1rem' }}>{shippingInfo.email}</p>
                        <p className="review-text">{shippingInfo.phone}</p>
                      </div>

                      <div className="review-section">
                        <h3 className="review-section-title">Payment Method</h3>
                        <p className="review-text" style={{ textTransform: 'capitalize' }}>
                          {paymentMethod.replace("-", " ")}
                        </p>
                      </div>

                      <div className="review-section">
                        <h3 className="review-section-title">Order Items</h3>
                        <div>
                          {items.map((item) => (
                            <div key={item.id} className="order-item">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="order-item-image"
                              />
                              <div style={{ flex: 1 }}>
                                <p className="order-item-name">{item.name}</p>
                                <p className="order-item-qty">Quantity: {item.quantity}</p>
                              </div>
                              <p className="order-item-price">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={isSubmitting}
                        className="continue-button"
                      >
                        <span>{isSubmitting ? "Processing Order..." : "Place Order"}</span>
                      </button>

                      <div className="secure-badge">
                        <Lock className="secure-badge-icon h-5 w-5" strokeWidth={1.5} />
                        <span className="secure-badge-text">Secure & Encrypted Payment</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="order-summary-card">
                  <h2 className="summary-title">Order Summary</h2>
                  
                  <div>
                    <div className="summary-row">
                      <span>Subtotal</span>
                      <span className="summary-value">${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="summary-row">
                      <span>Shipping</span>
                      <span className="summary-value">${shippingCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="summary-divider" />

                  <div className="summary-total">
                    <span>Total</span>
                    <span className="summary-total-value">${total.toFixed(2)}</span>
                  </div>

                  <div className="summary-info">
                    <p className="summary-info-text">
                      {items.length} {items.length === 1 ? "item" : "items"} in your order
                    </p>
                  </div>

                  <div className="secure-badge">
                    <Shield className="secure-badge-icon h-5 w-5" strokeWidth={1.5} />
                    <span className="secure-badge-text">Protected Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Checkout;
