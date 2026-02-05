import { Prisma } from "@prisma/client";
import { DEFAULT_MESSAGES, ERROR_CODES } from "./error-constants";
import { AppError } from "./route-error-handler";
import { headers } from "next/headers";
import { ActionError } from "@/types/action";

export const handleServerError = async (
  error: unknown,
): Promise<ActionError> => {
  const errorResponse: ActionError = {
    status: 500,
    message: DEFAULT_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
    isNetwork: false,
  };

  if (error instanceof AppError) {
    errorResponse.status = error.status;
    errorResponse.message = error.message;
    return errorResponse;
    // Handle specific prisma errors when the error code is 'P2025' meaning the element not found
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      errorResponse.status = 404;
      errorResponse.message = "The requested element is not found.";
      return errorResponse;
    }
  } else {
    const rawMessage = error instanceof Error ? error.message : String(error);
    errorResponse.isNetwork =
      rawMessage.includes("Can't reach database") ||
      rawMessage.includes("connection pool");

    if (errorResponse.isNetwork) {
      errorResponse.status = ERROR_CODES.NETWORK_ERROR;
      errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.NETWORK_ERROR];
    }
  }

  // Check if the request is an client action request
  const headersList = await headers();
  const isClientActionRequest = headersList.has("next-action");
  if (isClientActionRequest) {
    return errorResponse;
  }

  throw new Error(
    JSON.stringify({
      ...errorResponse,
    }),
  );
};
