import { Prisma } from "@prisma/client";
import { DEFAULT_MESSAGES, ERROR_CODES } from "./error-constants";
import { AppError } from "./app-error";
import { headers } from "next/headers";
import { ActionError } from "@/types/action";

export const handleActionError = async (
  error: unknown,
): Promise<ActionError> => {
  const errorResponse: ActionError = {
    status: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: DEFAULT_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR],
  };

  // Custom application errors
  if (error instanceof AppError) {
    errorResponse.status = error.status;
    errorResponse.message = error.message;
  }

  // Prisma specific errors (Database-level constraints and connectivity)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      // Prisma P2003: Foreign key constraint failed (Invalid Reference - 400)
      case "P2003":
        errorResponse.status = ERROR_CODES.BAD_REQUEST;
        errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.BAD_REQUEST];
        break;

      // Prisma P2025: Record to update/delete not found (Not Found - 404)
      case "P2025":
        errorResponse.status = ERROR_CODES.NOT_FOUND;
        errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.NOT_FOUND];
        break;

      // Prisma P2002: Unique constraint failed (Conflict/Validation - 422)
      case "P2002":
        errorResponse.status = ERROR_CODES.VALIDATION_ERROR;
        errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.VALIDATION_ERROR];
        break;

      // Prisma P1001: Can't reach database server (Network Error)
      case "P1001":
        errorResponse.status = ERROR_CODES.NETWORK_ERROR;
        errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.NETWORK_ERROR];
        break;

      // Prisma P1002: The database server was reached but timed out (Service Unavailable - 503)
      case "P1002":
        errorResponse.status = ERROR_CODES.SERVICE_UNAVAILABLE;
        errorResponse.message =
          DEFAULT_MESSAGES[ERROR_CODES.SERVICE_UNAVAILABLE];
        break;

      // Prisma P1008: Operations timed out (Timeout Error)
      case "P1008":
        errorResponse.status = ERROR_CODES.TIMEOUT_ERROR;
        errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.TIMEOUT_ERROR];
        break;

      // Default Prisma Error: Any other known prisma error not handled above
      default:
        errorResponse.status = ERROR_CODES.INTERNAL_SERVER_ERROR;
        errorResponse.message =
          DEFAULT_MESSAGES[ERROR_CODES.INTERNAL_SERVER_ERROR];
        break;
    }
  }

  // JWT/Auth Errors (Special handling if not already thrown as AppError)
  if (
    error instanceof Error &&
    (error.name === "JWTExpired" || error.name === "JOSEError")
  ) {
    errorResponse.status = ERROR_CODES.UNAUTHORIZED;
    errorResponse.message = DEFAULT_MESSAGES[ERROR_CODES.UNAUTHORIZED];
  }

  // Check if the request is an client action request
  const headersList = await headers();
  const isClientActionRequest = headersList.has("next-action");
  if (isClientActionRequest) {
    return errorResponse;
  }

  // Redirect to login page if session is missing or expired
  if (errorResponse.status === ERROR_CODES.UNAUTHORIZED) {
    const { redirect } = await import("next/navigation");
    redirect("/signin");
  }

  throw new Error(
    JSON.stringify({
      ...errorResponse,
    }),
  );
};
