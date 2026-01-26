"use client";
import { useState } from "react";
import {
  useElements,
  PaymentElement,
  useStripe,
} from "@stripe/react-stripe-js";
import { TShippingFormInputs } from "@/lib/schemas/payment";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

type Props = {
  shippingForm: TShippingFormInputs;
  clearCart: () => void;
};

function CheckoutForm({ shippingForm, clearCart }: Props) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

  const handleClick = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);
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
    setIsProcessing(false);
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
          disabled={isProcessing}
          onClick={handleClick}
          className="mt-4 w-full bg-gray-800 hover:bg-gray-900 text-white p-2 rounded-lg flex items-center justify-center"
        >
          {isProcessing ? <Spinner className="size-4 animate-spin" /> : null}
          {isProcessing ? "Processing..." : "Pay"}
        </button>
      )}
    </form>
  );
}

export default CheckoutForm;
