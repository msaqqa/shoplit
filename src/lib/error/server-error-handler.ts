import { DEFAULT_MESSAGES, ERROR_CODES } from "./error-constants";
import { AppError } from "./route-error-handler";

export const handleServerError = (error: unknown) => {
  let status: number | string = 500;
  let message = DEFAULT_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR];
  let isNetworkIssue = false;

  if (error instanceof AppError) {
    return {
      status: error.status,
      message: error.message,
      isNetwork: isNetworkIssue,
    };
  } else {
    const rawMessage = error instanceof Error ? error.message : String(error);
    isNetworkIssue =
      rawMessage.includes("Can't reach database") ||
      rawMessage.includes("connection pool");

    if (isNetworkIssue) {
      status = ERROR_CODES.NETWORK_ERROR;
      message = DEFAULT_MESSAGES[ERROR_CODES.NETWORK_ERROR];
    }
  }

  throw new Error(
    JSON.stringify({
      status,
      message,
      isNetwork: isNetworkIssue,
    }),
  );
};
