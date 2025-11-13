import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <Button onClick={() => navigate("/")}>Continue Shopping</Button>
          </div>
        </main>
        <Footer />
      </div>
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
    }
  };

  const handleContinueToReview = () => {
    setCurrentStep(3);
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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <Button
            variant="ghost"
            onClick={() => currentStep === 1 ? navigate("/cart") : setCurrentStep(currentStep - 1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Checkout</h1>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-8">
              <div className={`flex-1 h-2 rounded ${currentStep >= 1 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex-1 h-2 rounded ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex-1 h-2 rounded ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">Shipping Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleInputChange}
                          className={errors.fullName ? "border-destructive" : ""}
                        />
                        {errors.fullName && (
                          <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingInfo.email}
                          onChange={handleInputChange}
                          className={errors.email ? "border-destructive" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className={errors.address ? "border-destructive" : ""}
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className={errors.city ? "border-destructive" : ""}
                        />
                        {errors.city && (
                          <p className="text-sm text-destructive mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="state">State/Province *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleInputChange}
                          className={errors.state ? "border-destructive" : ""}
                        />
                        {errors.state && (
                          <p className="text-sm text-destructive mt-1">{errors.state}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP / Postal Code *</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={shippingInfo.zipCode}
                          onChange={handleInputChange}
                          className={errors.zipCode ? "border-destructive" : ""}
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-destructive mt-1">{errors.zipCode}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          name="country"
                          value={shippingInfo.country}
                          onChange={handleInputChange}
                          className={errors.country ? "border-destructive" : ""}
                        />
                        {errors.country && (
                          <p className="text-sm text-destructive mt-1">{errors.country}</p>
                        )}
                      </div>
                    </div>

                    <Button onClick={handleContinueToPayment} className="w-full">
                      Continue to Payment
                    </Button>
                  </div>
                </Card>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">Payment Method</h2>
                  </div>
                  
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-4 border rounded-md cursor-pointer hover:border-primary">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                          Credit / Debit Card
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-md cursor-pointer hover:border-primary">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                          PayPal
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-4 border rounded-md cursor-pointer hover:border-primary">
                        <RadioGroupItem value="cash-on-delivery" id="cash-on-delivery" />
                        <Label htmlFor="cash-on-delivery" className="flex-1 cursor-pointer">
                          Cash on Delivery
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>

                  <Button onClick={handleContinueToReview} className="w-full mt-6">
                    Continue to Review
                  </Button>
                </Card>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Order Review</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
                        <p className="text-muted-foreground">{shippingInfo.fullName}</p>
                        <p className="text-muted-foreground">{shippingInfo.address}</p>
                        <p className="text-muted-foreground">
                          {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                        </p>
                        <p className="text-muted-foreground">{shippingInfo.country}</p>
                        <p className="text-muted-foreground mt-2">{shippingInfo.email}</p>
                        <p className="text-muted-foreground">{shippingInfo.phone}</p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Payment Method</h3>
                        <p className="text-muted-foreground capitalize">
                          {paymentMethod.replace("-", " ")}
                        </p>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      disabled={isSubmitting}
                      className="w-full mt-6"
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </Card>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-secondary rounded-md">
                  <p className="text-sm text-muted-foreground">
                    {items.length} {items.length === 1 ? "item" : "items"} in your cart
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
