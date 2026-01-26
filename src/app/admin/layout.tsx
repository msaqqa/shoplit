import AppSidebar from "@/components/admin/AppSidebar";
import Navbar from "@/components/common/Navbar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex p-4">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
