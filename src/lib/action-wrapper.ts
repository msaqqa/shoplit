import { ActionResponse, ActionSuccess } from "@/types/action";
import { handleActionError } from "./error/action-error-handler";

export async function actionWrapper<T>(
  actionFn: () => Promise<ActionSuccess<T>>,
): Promise<ActionResponse<T>> {
  try {
    const result = await actionFn();
    return { data: result, error: null };
  } catch (error: unknown) {
    const errorData = await handleActionError(error);
    return { data: null, error: errorData };
  }
}
