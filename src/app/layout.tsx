import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "@/providers/ThemeProdider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AppSidebar from "@/components/admin/AppSidebar";
import { getCategories } from "@/services/categories";
import { geTProducts } from "@/services/products";
import { getUsers } from "@/services/users";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shoplit",
  description: "Shoplit",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const categories = await getCategories();
  const products = await geTProducts({});
  const users = await getUsers();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mx-auto py-4 px-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-7xl">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar
                categories={categories}
                products={products}
                users={users}
              />
              <main className="w-full">
                <Navbar />
                {children}
                <Footer />
              </main>
            </SidebarProvider>
          </ThemeProvider>
        </div>
        <ToastContainer position="bottom-right" />
      </body>
    </html>
  );
}
