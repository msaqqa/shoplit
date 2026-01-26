import type { Metadata } from "next";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";

export const metadata: Metadata = {
  title: "Shoplit",
  description: "Shoplit",
};

export default async function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto p-4">
      <Navbar />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
