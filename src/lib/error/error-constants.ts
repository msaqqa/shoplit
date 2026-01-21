/**
 * Error codes and their corresponding messages
 */
export const ERROR_CODES = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  DEFAULT: "ERROR",
};

/**
 * Default error messages for different scenarios
 */
export const DEFAULT_MESSAGES = {
  [ERROR_CODES.UNAUTHORIZED]: "Your session has expired. Please login again.",
  [ERROR_CODES.FORBIDDEN]: "You do not have permission to perform this action.",
  [ERROR_CODES.NOT_FOUND]: "The requested resource was not found.",
  [ERROR_CODES.VALIDATION_ERROR]: "Please check your input and try again.",
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: "An internal server error occurred.",
  [ERROR_CODES.SERVICE_UNAVAILABLE]: "The service is currently unavailable.",
  [ERROR_CODES.NETWORK_ERROR]:
    "Unable to connect to the server. Please check your internet connection.",
  [ERROR_CODES.TIMEOUT_ERROR]: "The request timed out. Please try again.",
  DEFAULT: "An unexpected error occurred.",
};
