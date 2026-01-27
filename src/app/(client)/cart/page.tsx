import CartDetails from "@/components/client/CartDetails";

export const metadata = {
  title: "Cart",
  robots: {
    index: false,
    follow: false,
  },
};

function CartPage() {
  return <CartDetails />;
}

export default CartPage;
