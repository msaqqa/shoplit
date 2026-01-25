"use client";
import { shippingFormSchema, TShippingFormInputs } from "@/lib/schemas/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

function ShippingForm({
  setShippingForm,
}: {
  setShippingForm: (data: TShippingFormInputs) => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TShippingFormInputs>({
    resolver: zodResolver(shippingFormSchema),
  });

  const handleShippingForm: SubmitHandler<TShippingFormInputs> = (data) => {
    console.log(data);
    setShippingForm(data);
    router.push("/cart?step=3", { scroll: false });
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleShippingForm)}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs font-medium text-gray-500">
          Name
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none test-sm"
          id="name"
          placeholder="John Doe"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-500 text-xs">{errors.name.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-xs font-medium text-gray-500">
          Email
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none test-sm"
          id="email"
          placeholder="johndoe@gmail.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs">{errors.email.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone" className="text-xs font-medium text-gray-500">
          Phone
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none test-sm"
          id="phone"
          placeholder="123456789"
          {...register("phone")}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs">{errors.phone.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-xs font-medium text-gray-500">
          Address
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none test-sm"
          id="address"
          placeholder="123 Main St, Anytown"
          {...register("address")}
        />
        {errors.address && (
          <p className="text-red-500 text-xs">{errors.address.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="city" className="text-xs font-medium text-gray-500">
          City
        </label>
        <input
          className="border-b border-gray-200 py-2 outline-none test-sm"
          id="city"
          placeholder="New York"
          {...register("city")}
        />
        {errors.city && (
          <p className="text-red-500 text-xs">{errors.city.message}</p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-gray-800 hover:bg-gray-900 transition-all duration-300 text-white p-2 rounded-lg cursor-pointer flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="w-3 h-3" />
      </button>
    </form>
  );
}

export default ShippingForm;
