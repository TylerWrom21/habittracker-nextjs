"use client";

import { ToastContainer, toast, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  options?: ToastOptions
) => {
  const getToastClass = () => {
    switch (type) {
      case "success":
        return "!bg-background !outline !outline-green-500 !text-primary !font-bold !rounded-lg !shadow-lg";
      case "error":
        return "!bg-background !outline !outline-red-500 !text-primary !font-bold !rounded-lg !shadow-lg";
      case "warning":
        return "!bg-background !outline !outline-yellow-500 !text-primary !font-bold !rounded-lg !shadow-lg";
      case "info":
      default:
        return "!bg-background !outline !outline-blue-500 !text-primary !font-bold !rounded-lg !shadow-lg";
    }
  };
  const getProgressClass = () => {
    switch (type) {
      case "success":
        return "!bg-green-500";
      case "error":
        return "!bg-red-500";
      case "warning":
        return "!bg-yellow-500";
      case "info":
      default:
        return "!bg-blue-500";
    }
  };

  const toastOptions: ToastOptions = {
    ...options,
    progressClassName: getProgressClass(),
    className: getToastClass(),
  };

  switch (type) {
    case "success":
      toast.success(message, toastOptions);
      break;
    case "error":
      toast.error(message, toastOptions);
      break;
    case "warning":
      toast.warning(message, toastOptions);
      break;
    case "info":
    default:
      toast.info(message, toastOptions);
      break;
  }
};


export const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
  );
};