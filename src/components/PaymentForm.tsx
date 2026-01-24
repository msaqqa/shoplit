import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import useCartStore from "@/stores/cartStore";
import useUserStore from "@/stores/userStore";
import CheckoutForm from "./CheckoutForm";
import { TShippingFormInputs } from "@/types/cart";
import { payOrder } from "@/services/orders";
import { useTheme } from "next-themes";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function PaymentForm({
  shippingForm,
}: {
  shippingForm: TShippingFormInputs;
}) {
  const { theme } = useTheme();
  const { cart, clearCart } = useCartStore();
  const { user } = useUserStore();
  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);
  const intentCreatedRef = useRef(false);

  const createPaymentIntent = async () => {
    if (!user?.id || cart.length === 0) {
      setError("Cannot create payment: missing user or empty cart");
      return null;
    }
    const products = cart.map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      price: p.price,
    }));
    const amount = products.reduce((acc, p) => acc + p.price * p.quantity, 0);

    const data = await payOrder({
      amount,
      userId: user?.id,
      products,
      email: shippingForm.email,
    }).catch((error) => {
      setError(error.message);
    });
    setClientSecret((data as { clientSecret: string }).clientSecret);
  };

  useEffect(() => {
    if (intentCreatedRef.current) return;
    intentCreatedRef.current = true;
    createPaymentIntent();
  }, []);

  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  if (!clientSecret) return <div>Loading payment...</div>;

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: theme === "dark" ? "night" : "stripe",
        },
      }}
    >
      <CheckoutForm shippingForm={shippingForm} clearCart={clearCart} />
    </Elements>
  );
}
