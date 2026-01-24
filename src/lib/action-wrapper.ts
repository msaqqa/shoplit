import { handleServerError } from "./error/server-error-handler";

export async function actionWrapper<T>(actionFn: () => Promise<T>) {
  try {
    const result = await actionFn();
    return { data: result, error: null };
  } catch (error: unknown) {
    const errorData = handleServerError(error);
    return { data: null, error: errorData };
  }
}
