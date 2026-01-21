import { handleServerError } from "./error/server-error-handler";

export async function actionWrapper<T>(actionFn: () => Promise<T>): Promise<T> {
  try {
    return await actionFn();
  } catch (error: unknown) {
    throw handleServerError(error);
  }
}
