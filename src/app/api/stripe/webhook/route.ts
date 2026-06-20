import Stripe from "stripe";
import { NextRequest } from "next/server";
import { placeOrder } from "@/app/actions/orders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    // Invalid signature is a client error; returning 400 stops Stripe from
    // pointlessly retrying a request that can never verify.
    console.error("Webhook signature verification failed:", err);
    return new Response("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const userId = Number(paymentIntent.metadata.userId);
      const products = JSON.parse(paymentIntent.metadata.products);
      const email = paymentIntent.metadata.email;
      const result = await placeOrder({
        userId,
        products,
        amount: paymentIntent.amount / 100,
        email,
        status: "success",
      });
      // If the order failed to persist, return 500 so Stripe retries the
      // event instead of silently dropping a paid order.
      if (result.error) {
        console.error("Failed to create order from webhook:", result.error);
        return new Response("Failed to create order", { status: 500 });
      }
      break;
    }
    case "payment_intent.payment_failed":
      console.log("Payment failed");
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }

  return new Response("OK", { status: 200 });
}
