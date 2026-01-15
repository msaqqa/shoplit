"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SearchBar from "./SearchBar";
import { Bell, Moon, Sun } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import TogleUserIcon from "./TogleUserIcon";
import SidebarButton from "./admin/SidebarButton";
import useUserStore from "@/stores/userStore";

function Navbar() {
  const { setTheme } = useTheme();
  const { user } = useUserStore();
  return (
    <nav className="w-full flex items-center justify-between pb-4 border-b border-gray-200 mb-6">
      {/* Right */}
      <div className="flex items-center gap-4">
        <SidebarButton />
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="w-6 h-6 md:h-9"
          />
          <p className="hidden md:block text-md font-medium tracking-wider">
            Shoplit
          </p>
        </Link>
      </div>
      {/* Left */}
      <div className="flex items-center gap-4">
        <SearchBar />
        {user && (
          <>
            <Bell className="w-4 h-4 text-gray-600" />
            <ShoppingCartIcon />
          </>
        )}
        <TogleUserIcon />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navbar;
