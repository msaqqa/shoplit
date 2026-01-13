"use client";
import useCartStore from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function ShoppingCartIcon() {
  const { cart, hasHydrated } = useCartStore();
  const [mounted, setMounted] = useState(false);
  // if (!hasHydrated) return null;

  useEffect(() => setMounted(true), []);

  const count = cart.reduce((acc, cur) => acc + cur.quantity, 0);
  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="w-4 h-4 text-gray-600" />
      {mounted && hasHydrated && count > 0 && (
        <span className="absolute -top-3 -right-3 bg-amber-400 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
          {count}
        </span>
      )}
    </Link>
  );
}

export default ShoppingCartIcon;
