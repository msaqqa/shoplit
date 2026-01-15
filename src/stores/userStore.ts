import { TUserStoreState, TUserStoreActions } from "@/types/users";
import { create } from "zustand";
import { persist, devtools, createJSONStorage } from "zustand/middleware";

const useUserStore = create<TUserStoreState & TUserStoreActions>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        hasHydrated: false,
        signinUser: (user) => set({ user }),
        signoutUser: () => set({ user: null }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: (state) => {
          if (state) {
            state.hasHydrated = true;
          }
        },
      }
    ),
    { name: "user-store", enabled: process.env.NODE_ENV === "development" }
  )
);

export default useUserStore;
