import { DEFAULT_MESSAGES, ERROR_CODES } from "./error-constants";

export const handleServerError = (error: unknown): never => {
  const rawMessage = error instanceof Error ? error.message : String(error);

  const isNetworkIssue =
    rawMessage.includes("Can't reach database") ||
    rawMessage.includes("connection pool");

  const status = isNetworkIssue ? ERROR_CODES.NETWORK_ERROR : 500;
  const messageKey = isNetworkIssue
    ? ERROR_CODES.NETWORK_ERROR
    : ERROR_CODES.INTERNAL_SERVER_ERROR;

  throw new Error(
    JSON.stringify({
      status: status,
      message: DEFAULT_MESSAGES[messageKey],
      isNetwork: isNetworkIssue,
    }),
  );
};
