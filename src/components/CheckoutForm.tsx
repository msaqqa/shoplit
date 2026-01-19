"use client";
import { useState } from "react";
import {
  useElements,
  PaymentElement,
  useStripe,
} from "@stripe/react-stripe-js";
import { TShippingFormInputs } from "@/types/cart";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

type Props = {
  shippingForm: TShippingFormInputs;
  clearCart: () => void;
};

function CheckoutForm({ shippingForm, clearCart }: Props) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const handleClick = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        payment_method_data: {
          billing_details: {
            email: shippingForm.email,
            name: shippingForm.name,
            address: {
              line1: shippingForm.address,
              city: shippingForm.city,
            },
          },
        },
      },
    });

    if (result.error) {
      toast.error(result.error.message || "Payment failed");
    } else {
      toast.success("Payment confirmed! Thank you.");
      clearCart();
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <form>
      <PaymentElement
        options={{ layout: "tabs", paymentMethodOrder: ["card"] }}
        onReady={() => setPaymentReady(true)}
      />
      {paymentReady && (
        <button
          type="button"
          disabled={loading}
          onClick={handleClick}
          className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-lg flex items-center justify-center"
        >
          {loading ? "Processing..." : "Pay"}
        </button>
      )}
    </form>
  );
}

export default CheckoutForm;
