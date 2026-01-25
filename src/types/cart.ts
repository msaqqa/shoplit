import { TProduct } from "./products";

// Cart type
export type TCartItem = TProduct & {
  quantity: number;
  selectedSize: string;
  selectedColor: string;
};

// Cart data type
export type TCartItems = TCartItem[];

// Cart store type
export type TCartStoreState = {
  cart: TCartItems;
  hasHydrated: boolean;
};

// Cart store actions type
export type TCartStoreActions = {
  addToCart: (product: TCartItem) => void;
  removeFromCart: (product: TCartItem) => void;
  clearCart: () => void;
};
