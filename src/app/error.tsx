"use client";

import { AlertCircle, RefreshCcw, RotateCw, WifiOff } from "lucide-react";
import {
  ERROR_CODES,
  handleApiError,
  DEFAULT_MESSAGES,
} from "@/lib/error/api-error-handler";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  let displayMessage = DEFAULT_MESSAGES.DEFAULT;
  let displayStatus: string | number = 500;
  let isNetwork = false;

  // الحالة الأولى: خطأ مهيكل من السيرفر (بصمة الـ actionWrapper)
  if (error.message.includes('"isServer":true')) {
    try {
      const serverErr = JSON.parse(error.message);
      isNetwork = serverErr.message === "NETWORK_ERROR";
      displayStatus = serverErr.status || 500;
      const translatedMessage =
        DEFAULT_MESSAGES[serverErr.message as keyof typeof DEFAULT_MESSAGES];

      if (isNetwork) {
        displayMessage =
          translatedMessage ||
          "Unable to connect to the database. Please check your internet connection.";
      } else {
        displayMessage = translatedMessage || serverErr.message;
      }
    } catch {
      displayMessage = error.message;
    }
  }

  // الحالة الثانية: خطأ قادم من Axios (API)
  else if (
    ("isAxiosError" in error && error.isAxiosError) ||
    error.message.includes("Axios")
  ) {
    const response = handleApiError(error, { showNotification: false });
    displayMessage = response.message;
    displayStatus = response.status;
    isNetwork = response.status === ERROR_CODES.NETWORK_ERROR;
  }

  // الحالة الثالثة: خطأ غير متوقع في الكلاينت (React / Browser)
  else {
    isNetwork =
      error.message.toLowerCase().includes("fetch") ||
      (typeof window !== "undefined" && !window.navigator.onLine);
    displayMessage = isNetwork ? "Network connection lost." : error.message;
    displayStatus = isNetwork ? "OFFLINE" : "CLIENT_ERROR";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 bg-white dark:bg-[#0a0a0a]">
      <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-zinc-800 max-w-md w-full text-center">
        <div
          className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
            isNetwork
              ? "bg-amber-50 dark:bg-amber-900/10"
              : "bg-zinc-100 dark:bg-zinc-800/50"
          }`}
        >
          {isNetwork ? (
            <WifiOff className="h-10 w-10 text-amber-500" />
          ) : (
            <AlertCircle className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
          {isNetwork ? "Connection Lost" : "Something went wrong"}
        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed px-2">
          {displayMessage}
        </p>

        <div className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono mb-8 border border-zinc-200 dark:border-zinc-700/30 uppercase tracking-widest">
          Code: {displayStatus} | ID: {error.digest?.substring(0, 8) || "Local"}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 px-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-zinc-200 dark:shadow-none"
          >
            <RotateCw className="h-4 w-4" /> Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-white dark:bg-transparent text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-all active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" /> Reload
          </button>
        </div>
      </div>

      <p className="mt-8 text-zinc-400 dark:text-zinc-600 text-[11px] uppercase tracking-[0.2em]">
        System Failure Protocol Activated
      </p>
    </div>
  );
}
