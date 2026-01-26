"use client";
import dynamic from "next/dynamic";

const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false },
);

function ToastProvider() {
  return <ToastContainer position="bottom-right" />;
}

export default ToastProvider;
