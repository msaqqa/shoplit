import { TCartStoreActions, TCartStoreState } from "@/types/cart";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

const useCartStore = create<TCartStoreState & TCartStoreActions>()(
  devtools(
    persist(
      (set) => ({
        cart: [],
        hasHydrated: false,
        addToCart: (product) =>
          set((state) => {
            const existingProduct = state.cart.find(
              (item) =>
                item.id === product.id &&
                item.selectedSize === product.selectedSize &&
                item.selectedColor === product.selectedColor
            );
            if (existingProduct) {
              return {
                cart: state.cart.map((item) =>
                  item.id === product.id
                    ? {
                        ...item,
                        quantity: item.quantity + product.quantity || 1,
                      }
                    : item
                ),
              };
            } else {
              return { cart: [...state.cart, product] };
            }
          }),
        // another solution
        //  set((state) => {
        //   const existingIndex = state.cart.findIndex(
        //     (p) =>
        //       p.id === product.id &&
        //       p.selectedSize === product.selectedSize &&
        //       p.selectedColor === product.selectedColor
        //   );

        //   if (existingIndex !== -1) {
        //     const updatedCart = [...state.cart];
        //     updatedCart[existingIndex].quantity += product.quantity || 1;
        //     return { cart: updatedCart };
        //   }

        //   return {
        //     cart: [
        //       ...state.cart,
        //       {
        //         ...product,
        //         quantity: product.quantity || 1,
        //         selectedSize: product.selectedSize,
        //         selectedColor: product.selectedColor,
        //       },
        //     ],
        //   };
        // }),
        removeFromCart: (product) =>
          set((state) => ({
            cart: state.cart.filter(
              (item) =>
                !(
                  item.id === product.id &&
                  item.selectedSize === product.selectedSize &&
                  item.selectedColor === product.selectedColor
                )
            ),
          })),
        clearCart: () => set({ cart: [] }),
      }),
      {
        name: "cart-storage",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: (state) => {
          if (state) {
            state.hasHydrated = true;
          }
        },
      }
    ),
    { name: "cart-store", enabled: process.env.NODE_ENV === "development" }
  )
);

export default useCartStore;
