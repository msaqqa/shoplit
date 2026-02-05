// Api error type
export type TApiErrorData = {
  status: number;
  message: string;
  error: Error;
  errors: Error;
  response: {
    status: number;
    message: string;
    error: Error;
  };
};

// Api response type
export type TApiErrorResponse = {
  status: number | string;
  message: string;
  data: TApiErrorData;
  type: string;
  validationErrors?: unknown;
};
