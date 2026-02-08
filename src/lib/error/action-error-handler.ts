import { Prisma } from "@prisma/client";
import { DEFAULT_MESSAGES, ERROR_CODES } from "./error-constants";
import { AppError } from "./app-error";
import { headers } from "next/headers";
import { ActionError } from "@/types/action";

export const handleActionError = async (
  error: unknown,
): Promise<ActionError> => {
  const errorResponse: ActionError = {
    status: 500,
    message: DEFAULT_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
    isNetwork: false,
  };

  // Custom application errors
  if (error instanceof AppError) {
    errorResponse.status = error.status;
    errorResponse.message = error.message;
    return errorResponse;
  }

  // Prisma specific errors (Database errors)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1001: Can't reach database server
    // P1002: The database server was reached but timed out
    // P1008: Operations timed out
    if (["P1001", "P1002", "P1008"].includes(error.code)) {
      errorResponse.status = ERROR_CODES.NETWORK_ERROR;
      errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.NETWORK_ERROR];
      errorResponse.isNetwork = true;
      return errorResponse;
    }
    // Error: item not found
    // P2025: Record to update or delete not found
    if (error.code === "P2025") {
      errorResponse.status = ERROR_CODES.NOT_FOUND;
      errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.NOT_FOUND];
      return errorResponse;
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
