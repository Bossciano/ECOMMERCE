import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      customerEmail,
      customerName,
      items,
      total,
      shippingAddress,
    }: OrderConfirmationRequest = await req.json();

    console.log("Sending order confirmation email to:", customerEmail);

    // Build items HTML
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #eee;">
            ${item.name}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
            $${item.price.toFixed(2)}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin-bottom: 10px;">Thank you for your order!</h1>
            <p style="color: #666; font-size: 16px;">Hi ${customerName}, your order has been confirmed.</p>
          </div>

          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h2 style="margin-top: 0; color: #000;">Order Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId.slice(0, 8).toUpperCase()}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #000;">Shipping Address</h3>
            <p style="margin: 5px 0;">${shippingAddress.address}</p>
            <p style="margin: 5px 0;">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}</p>
            <p style="margin: 5px 0;">${shippingAddress.country}</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #000;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
          </div>

          <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
              <span>Order Total:</span>
              <span>$${total.toFixed(2)}</span>
            </div>
          </div>

          <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p>Thank you for shopping with us!</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "SHOP <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Order Confirmation - ${orderId.slice(0, 8).toUpperCase()}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
