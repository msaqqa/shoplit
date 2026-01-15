import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: NextRequest) {
  const { amount, userId, products, email } = await req.json();

  try {
    if (!amount || !userId) {
      throw new Error("Missing amount or userId");
    }

    // ⚡ Stripe requires amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
      automatic_payment_methods: { enabled: false },
      metadata: {
        userId: String(userId),
        products: JSON.stringify(products || []),
        email,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create PaymentIntent";
    return NextResponse.json({ message }, { status: 500 });
  }
}
