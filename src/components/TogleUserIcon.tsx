"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserStore from "@/stores/userStore";
import { LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";

function TogleUserIcon() {
  const { user, signoutUser } = useUserStore();
  const router = useRouter();
  const handleUserLogout = async () => {
    await logout();
    router.push("/signin");
    signoutUser();
  };
  console.log("user", user);
  if (!user) {
    return (
      <>
        <Link href="/signin" title="Sign in">
          <LogIn size={20} />
        </Link>
        <Link href="/signup" title="Sign up">
          <UserPlus size={20} />
        </Link>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10}>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="size-[1.2rem] mr-2" />
          <Link href="/account">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="size-[1.2rem] mr-2" /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleUserLogout}>
          <LogOut className="size-[1.2rem] mr-2" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TogleUserIcon;
