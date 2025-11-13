import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  status: string;
  created_at: string;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data as Order);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-background">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Order Not Found</h1>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Order Confirmed!
              </h1>
              <p className="text-muted-foreground">
                Thank you for your purchase, {order.customer_name}
              </p>
            </div>

            {/* Order Details Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-mono font-semibold text-foreground">
                    {order.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold text-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Confirmation Messages */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-secondary rounded-md">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Confirmation Email Sent</p>
                    <p className="text-sm text-muted-foreground">
                      We've sent a confirmation email to {order.customer_email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary rounded-md">
                  <Package className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Order Processing</p>
                    <p className="text-sm text-muted-foreground">
                      Your order is being prepared for shipment
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Shipping Address</h3>
                <p className="text-muted-foreground">{order.customer_name}</p>
                <p className="text-muted-foreground">{order.shipping_address.address}</p>
                <p className="text-muted-foreground">
                  {order.shipping_address.city}, {order.shipping_address.state}{" "}
                  {order.shipping_address.zipCode}
                </p>
                <p className="text-muted-foreground">{order.shipping_address.country}</p>
              </div>

              <Separator className="my-4" />

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-2">Payment Method</h3>
                <p className="text-muted-foreground capitalize">
                  {order.payment_method.replace("-", " ")}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Order Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Order Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span>${order.shipping_cost.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-foreground">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Link to="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
