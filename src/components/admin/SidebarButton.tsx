"use client";
import { SidebarTrigger } from "../ui/sidebar";
import useUserStore from "@/stores/userStore";

function SidebarButton() {
  const { user } = useUserStore();
  if (user && "role" in user && user.role === "ADMIN") {
    return <SidebarTrigger />;
  }
  return <></>;
}

export default SidebarButton;
