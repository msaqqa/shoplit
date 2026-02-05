import { ActionResponse, ActionSuccess } from "@/types/action";
import { handleServerError } from "./error/server-error-handler";

export async function actionWrapper<T>(
  actionFn: () => Promise<ActionSuccess<T>>,
): Promise<ActionResponse<T>> {
  try {
    const result = await actionFn();
    return { data: result, error: null };
  } catch (error: unknown) {
    const errorData = await handleServerError(error);
    return { data: null, error: errorData };
  }
}
