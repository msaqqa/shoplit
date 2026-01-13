import { z } from "zod";
import { TProduct } from "./products";

// Cart
export type TCartItem = TProduct & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

export type TCartItems = TCartItem[];

// Payment
export const shippingFormSchema = z.object({
  name: z.string().min(1, "Name is required!"),
  email: z.email().min(1, "Email is required!"),
  phone: z.string().min(7, "Phone number must be contains 7 digits!"),
  address: z.string().min(1, "Address is required!"),
  city: z.string().min(1, "City is required!"),
});

export type TShippingFormInputs = z.infer<typeof shippingFormSchema>;

// Cart Store
export type TCartStoreState = {
  cart: TCartItems;
  hasHydrated: boolean;
};

export type TCartStoreActions = {
  addToCart: (product: TCartItem) => void;
  removeFromCart: (product: TCartItem) => void;
  clearCart: () => void;
};
