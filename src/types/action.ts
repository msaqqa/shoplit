// Action error type
export type ActionError = {
  message: string;
  status: number | string;
};

// Action success type
export type ActionSuccess<T> = {
  data: T;
  message?: string;
};

// Action response type
export type ActionResponse<T> =
  | { data: ActionSuccess<T>; error: null }
  | { data: null; error: ActionError };
