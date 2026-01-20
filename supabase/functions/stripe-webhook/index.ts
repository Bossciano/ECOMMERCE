import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!)

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        
        // Update order status
        await supabase
          .from('orders')
          .update({ 
            status: 'paid',
            payment_intent_id: paymentIntent.id 
          })
          .eq('id', paymentIntent.metadata.order_id)
        
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        
        await supabase
          .from('orders')
          .update({ status: 'payment_failed' })
          .eq('id', failedPayment.metadata.order_id)
        
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
