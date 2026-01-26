"use client";

import Link from "next/link";
import Lottie from "lottie-react";
import animationData from "@/animations/404.json";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen min-h-min flex flex-col items-center justify-center p-6">
      <div className="bg-white dark:bg-[#121212] p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-zinc-800/50 max-w-lg w-full text-center flex flex-col items-center">
        <div className="w-80 h-80 md:w-96 md:h-96 -mt-10">
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        </div>
        <div className="mt-8 flex flex-col gap-3 w-full">
          <Link
            href="/signin"
            className="flex items-center justify-center gap-2 w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-yellow-500/20"
          >
            Sign in
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-transparent text-zinc-600 dark:text-zinc-400 font-medium rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            <MoveLeft size={18} />
            Return to Home
          </Link>
        </div>
      </div>
      <div className="fixed top-1/4 left-1/4 w-64 h-64 bg-yellow-500/10 blur-[120px] rounded-full -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
    </div>
  );
}
