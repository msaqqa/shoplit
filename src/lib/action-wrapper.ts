import { handleServerError } from "./error/server-error-handler";

export type ActionSuccess<T> = {
  data: T;
  message?: string;
};

export type ActionResponse<T> =
  | { data: ActionSuccess<T>; error: null }
  | { data: null; error: { message: string; statusCode?: number } };

export async function actionWrapper<T>(
  actionFn: () => Promise<ActionSuccess<T>>,
): Promise<ActionResponse<T>> {
  try {
    const result = await actionFn();
    return { data: result, error: null };
  } catch (error: unknown) {
    const errorData = handleServerError(error);
    return { data: null, error: errorData };
  }
}
