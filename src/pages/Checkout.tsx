// ============================================================================
// IMPROVED CHECKOUT PAGE WITH STRIPE INTEGRATION
// ============================================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/enhanced-auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, CreditCard, Truck, Check, Lock, Shield, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe, createPaymentIntent, formatAmountForStripe } from "@/lib/stripe-integration";
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

// ============================================================================
// PAYMENT FORM COMPONENT
// ============================================================================

const CheckoutForm = ({
  shippingInfo,
  totalAmount,
  items,
  onSuccess,
}: {
  shippingInfo: ShippingFormData;
  totalAmount: number;
  items: any[];
  onSuccess: (orderId: string) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm the payment
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      // Create order in database first
      const orderData = {
        user_id: user?.id || null,
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
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totalAmount - 10,
        shipping_cost: 10,
        total: totalAmount,
        payment_method: 'card',
        payment_status: 'pending',
        status: 'pending',
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Confirm payment with Stripe
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${order.id}`,
          payment_method_data: {
            billing_details: {
              name: shippingInfo.fullName,
              email: shippingInfo.email,
              phone: shippingInfo.phone,
              address: {
                line1: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                postal_code: shippingInfo.zipCode,
                country: shippingInfo.country,
              },
            },
          },
        },
      });

      if (error) {
        // Update order status to failed
        await supabase
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('id', order.id);

        throw new Error(error.message);
      }

      // Clear cart on success
      clearCart();
      onSuccess(order.id);
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-xl border-2 border-[#c2a46d]/30">
        <h3 className="text-lg font-semibold mb-4 text-[#3b2f2f]">Payment Details</h3>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-[#3b2f2f] to-[#2a211f] text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            <span>Pay ${totalAmount.toFixed(2)}</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-[#6b5c4d]">
        <Shield className="h-4 w-4" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </form>
  );
};

// ============================================================================
// MAIN CHECKOUT COMPONENT
// ============================================================================

const ImprovedCheckout = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingFormData>({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  const shippingCost = 10.00;
  const total = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf8f4]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-[#3b2f2f]">Your cart is empty</h1>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ShippingFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
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

  const handleContinueToPayment = async () => {
    if (!validateShipping()) {
      return;
    }

    setIsLoadingPayment(true);

    try {
      // Create payment intent
      const paymentData = {
        amount: total,
        currency: 'usd',
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shipping: shippingInfo,
        customerEmail: shippingInfo.email,
      };

      const result = await createPaymentIntent(paymentData);
      setClientSecret(result.clientSecret);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const stripePromise = getStripe();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#faf8f4] to-[#f3eee6]">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <button
          onClick={() => (currentStep === 1 ? navigate('/cart') : setCurrentStep(1))}
          className="mb-6 flex items-center gap-2 text-[#6b5c4d] hover:text-[#3b2f2f] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <h1 className="text-4xl font-bold mb-8 text-[#3b2f2f]">Secure Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 1
                  ? 'bg-[#c2a46d] text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {currentStep > 1 ? <Check className="h-5 w-5" /> : '1'}
            </div>
            <span className="font-medium text-[#3b2f2f]">Shipping</span>
          </div>

          <div className={`h-1 w-16 ${currentStep >= 2 ? 'bg-[#c2a46d]' : 'bg-gray-200'}`} />

          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep >= 2
                  ? 'bg-[#c2a46d] text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              2
            </div>
            <span className="font-medium text-[#3b2f2f]">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 ? (
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#c2a46d]/30">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-6 w-6 text-[#c2a46d]" />
                  <h2 className="text-2xl font-bold text-[#3b2f2f]">Shipping Information</h2>
                </div>

                <div className="grid gap-4">
                  {/* Form fields */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'border-red-500' : ''}
                    />
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        className={errors.zipCode ? 'border-red-500' : ''}
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        className={errors.country ? 'border-red-500' : ''}
                      />
                      {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                    </div>
                  </div>

                  <Button
                    onClick={handleContinueToPayment}
                    disabled={isLoadingPayment}
                    className="w-full mt-4 bg-[#c2a46d] hover:bg-[#b8941f] text-white"
                  >
                    {isLoadingPayment ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Loading...
                      </>
                    ) : (
                      'Continue to Payment'
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#c2a46d]/30">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-6 w-6 text-[#c2a46d]" />
                  <h2 className="text-2xl font-bold text-[#3b2f2f]">Payment</h2>
                </div>

                {clientSecret && stripePromise && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                        variables: {
                          colorPrimary: '#c2a46d',
                        },
                      },
                    }}
                  >
                    <CheckoutForm
                      shippingInfo={shippingInfo}
                      totalAmount={total}
                      items={items}
                      onSuccess={(orderId) => navigate(`/order-confirmation/${orderId}`)}
                    />
                  </Elements>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#c2a46d] sticky top-24">
              <h3 className="text-xl font-bold mb-4 text-[#3b2f2f]">Order Summary</h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-[#6b5c4d]">
                  <span>Subtotal</span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6b5c4d]">
                  <span>Shipping</span>
                  <span className="font-medium">${shippingCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t-2 border-[#c2a46d]/30 pt-3 mb-4">
                <div className="flex justify-between text-lg font-bold text-[#3b2f2f]">
                  <span>Total</span>
                  <span className="text-[#c2a46d]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[#f3eee6] p-3 rounded-lg">
                <p className="text-sm text-center text-[#6b5c4d]">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ImprovedCheckout;
