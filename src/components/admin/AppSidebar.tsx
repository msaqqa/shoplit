"use client";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Inbox,
  Search,
  Settings,
  ChevronUp,
  User2,
  Plus,
  Projector,
  Shirt,
  User,
  ShoppingBasket,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AddOrder from "./AddOrder";
import AddProduct from "./AddProduct";
import AddCategory from "./AddCategory";
import useUserStore from "@/stores/userStore";
import { useState } from "react";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import AddUser from "./AddUser";

// Menu items.
const items = [
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

function AppSidebar() {
  const router = useRouter();
  const { user, signoutUser } = useUserStore();
  const [openCategory, setOpenCategory] = useState(false);
  const [openProduct, setOpenProduc] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [openUser, setOpenUser] = useState(false);

  const handleUserLogout = async () => {
    await logout();
    router.push("/signin");
    signoutUser();
  };

  if (user && "role" in user && user.role === "ADMIN") {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader className="py-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive>
                <Link href="/admin">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.title === "Inbox" && (
                      <SidebarMenuBadge>24</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Categories */}
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/categories">
                      <Projector />
                      <span>See All Categories</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Sheet open={openCategory} onOpenChange={setOpenCategory}>
                      <SheetTrigger asChild>
                        <SidebarMenuButton>
                          <Plus />
                          <span>Add Category</span>
                        </SidebarMenuButton>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <AddCategory onSuccess={() => setOpenCategory(false)} />
                      </SheetContent>
                    </Sheet>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Products */}
          <SidebarGroup>
            <SidebarGroupLabel>Products</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/products">
                      <Shirt />
                      <span>See All Products</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Sheet open={openProduct} onOpenChange={setOpenProduc}>
                      <SheetTrigger asChild>
                        <SidebarMenuButton>
                          <Plus />
                          <span>Add Product</span>
                        </SidebarMenuButton>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <AddProduct onSuccess={() => setOpenProduc(false)} />
                      </SheetContent>
                    </Sheet>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Users */}
          <SidebarGroup>
            <SidebarGroupLabel>Users</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/users">
                      <User />
                      <span>See All Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Sheet open={openUser} onOpenChange={setOpenUser}>
                      <SheetTrigger asChild>
                        <SidebarMenuButton>
                          <Plus />
                          <span>Add User</span>
                        </SidebarMenuButton>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <AddUser onSuccess={() => setOpenUser(false)} />
                      </SheetContent>
                    </Sheet>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          {/* Payment / Oreders */}
          <SidebarGroup>
            <SidebarGroupLabel>Oreders</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/admin/orders">
                      <ShoppingBasket />
                      <span>See All Orders</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Sheet open={openOrder} onOpenChange={setOpenOrder}>
                      <SheetTrigger asChild>
                        <SidebarMenuButton>
                          <Plus />
                          <span>Add Oreder</span>
                        </SidebarMenuButton>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                        <AddOrder onSuccess={() => setOpenOrder(false)} />
                      </SheetContent>
                    </Sheet>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 />
                    <span>{user.name}</span>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent sideOffset={10} align="end">
                  <DropdownMenuItem>
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleUserLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    );
  } else {
    return null;
  }
}

export default AppSidebar;
