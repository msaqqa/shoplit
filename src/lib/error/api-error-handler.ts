import axios from "axios";
import { toast } from "react-toastify";
import { DEFAULT_MESSAGES, ERROR_CODES } from "./error-constants";
import { TApiErrorResponse } from "@/types/api";

/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from axios
 * @param {Object} options - Additional options for error handling
 * @returns {Object} Formatted error object
 */

export const handleApiError = (
  error: unknown,
  options = { showNotification: true },
) => {
  let errorResponse!: TApiErrorResponse;

  // Handle axios errors
  if (axios.isAxiosError(error)) {
    errorResponse = {
      status: error.response?.status as number,
      message:
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message,
      data: error.response?.data,
      type: "error",
    };
  }

  // Handle network errors
  if (axios.isAxiosError(error) && !error.response) {
    if (error.code === "ECONNABORTED") {
      errorResponse = {
        ...errorResponse,
        status: ERROR_CODES.TIMEOUT_ERROR,
        message: DEFAULT_MESSAGES[ERROR_CODES.TIMEOUT_ERROR],
      };
    } else {
      errorResponse = {
        ...errorResponse,
        status: ERROR_CODES.NETWORK_ERROR,
        message: DEFAULT_MESSAGES[ERROR_CODES.NETWORK_ERROR],
      };
    }
  }

  // Get default message if none provided
  if (!errorResponse.message) {
    errorResponse.message =
      DEFAULT_MESSAGES[errorResponse.status] || DEFAULT_MESSAGES.DEFAULT;
  }

  // Handle specific error codes
  switch (errorResponse.status) {
    case ERROR_CODES.UNAUTHORIZED:
      document.cookie = "token=; max-age=0";
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes("/signin")) {
        window.location.href = "/signin";
      }
      break;

    case ERROR_CODES.VALIDATION_ERROR:
      // Format validation errors if available
      if (errorResponse.data?.errors) {
        errorResponse.validationErrors = errorResponse.data?.errors;
        errorResponse.message = Object.values(errorResponse.data.errors)
          .flat()
          .join(", ");
      }
      break;

    case ERROR_CODES.FORBIDDEN:
      errorResponse = {
        ...errorResponse,
        status: ERROR_CODES.FORBIDDEN,
        message:
          errorResponse.message || DEFAULT_MESSAGES[ERROR_CODES.FORBIDDEN],
      };
      break;

    default:
      // Log unexpected errors
      if (Number(errorResponse.status) >= 500) {
        errorResponse = {
          ...errorResponse,
          status: ERROR_CODES.INTERNAL_SERVER_ERROR,
          message: DEFAULT_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
        };
        console.error("Server Error:", errorResponse);
      }
  }

  // Show toast if enabled
  const isBrowser = typeof window !== "undefined";
  if (options.showNotification && isBrowser) {
    toast.error(errorResponse.message);
  }

  // Check if the error is "Fatal" (e.g., Server Crash or Network Failure)
  const isFatalError =
    errorResponse.status === ERROR_CODES.NETWORK_ERROR ||
    errorResponse.status === ERROR_CODES.TIMEOUT_ERROR ||
    Number(errorResponse.status) >= 500;

  // Throw fatal errors to show in the error boundary (Error.tsx)
  if (isFatalError) {
    throw new Error(
      JSON.stringify({
        ...errorResponse,
        isNetwork: errorResponse.status === ERROR_CODES.NETWORK_ERROR,
      }),
    );
  }

  return errorResponse;
};
