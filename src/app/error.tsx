"use client";
import { DEFAULT_MESSAGES, ERROR_CODES } from "@/lib/error/error-constants";
import { AlertCircle, RefreshCcw, RotateCw, WifiOff } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Default values in case parsing fails
  let errorDetails = {
    message: DEFAULT_MESSAGES.DEFAULT,
    status: ERROR_CODES.DEFAULT,
    isNetwork: false,
  };

  // Check for client-side connectivity issues
  const isOffline = typeof window !== "undefined" && !navigator.onLine;
  if (isOffline) {
    errorDetails.message = DEFAULT_MESSAGES[ERROR_CODES.NETWORK_ERROR];
    errorDetails.status = ERROR_CODES.NETWORK_ERROR;
    errorDetails.isNetwork = true;
  }

  // Try to extract structured error data if available
  if (error.message && error.message.startsWith("{")) {
    try {
      const parsed = JSON.parse(error.message);
      errorDetails = {
        message: parsed.message || DEFAULT_MESSAGES.DEFAULT,
        status: parsed.status || ERROR_CODES.DEFAULT,
        isNetwork: parsed.isNetwork || false,
      };
    } catch {}
  }

  return (
    <div className="h-screen min-h-min flex flex-col items-center justify-center p-8 bg-white dark:bg-[#0a0a0a]">
      <div className="bg-white dark:bg-[#121212] p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-zinc-800 max-w-md w-full text-center">
        <div
          className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full mb-6 ${
            errorDetails.isNetwork
              ? "bg-amber-50 dark:bg-amber-900/10"
              : "bg-zinc-100 dark:bg-zinc-800/50"
          }`}
        >
          {errorDetails.isNetwork ? (
            <WifiOff className="h-10 w-10 text-amber-500" />
          ) : (
            <AlertCircle className="h-10 w-10 text-zinc-900 dark:text-zinc-100" />
          )}
        </div>

        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
          {errorDetails.isNetwork ? "Connection Issue" : "Something went wrong"}
        </h2>

        <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed px-2">
          {errorDetails.message}
        </p>

        <div className="inline-block px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500 text-[10px] font-mono mb-8 border border-zinc-200 dark:border-zinc-700/30 uppercase tracking-widest">
          Code: {errorDetails.status} | ID:{" "}
          {error.digest?.substring(0, 8) || "Local"}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-3.5 px-4 rounded-xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg"
          >
            <RotateCw className="h-4 w-4" /> Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-white dark:bg-transparent text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" /> Reload
          </button>
        </div>
      </div>
    </div>
  );
}
