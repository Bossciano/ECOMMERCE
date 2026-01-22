import { loadStripe } from "@stripe/stripe-js";

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!
    );
  }
  return stripePromise;
};

export const formatAmountForStripe = (amount: number) => {
  return Math.round(amount * 100);
};

export const createPaymentIntent = async (data: {
  amount: number;
  currency: string;
  items: any[];
  shipping: any;
  customerEmail: string;
}) => {
  const res = await fetch("/.netlify/functions/create-payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      amount: formatAmountForStripe(data.amount),
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create payment intent");
  }

  return res.json();
};
