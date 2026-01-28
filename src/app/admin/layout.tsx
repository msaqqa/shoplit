import AppSidebar from "@/components/admin/AppSidebar";
import Navbar from "@/components/common/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import SidebarButton from "@/components/admin/SidebarButton";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex p-4">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar SidebarButton={SidebarButton} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
