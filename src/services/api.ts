import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { handleApiError } from "../lib/error/api-error-handler";

// Extend AxiosRequestConfig to allow showNotification
interface CustomAxiosRequestConfig<T = unknown> extends AxiosRequestConfig<T> {
  showNotification?: boolean;
  returnOnly?: boolean;
}

// Extend AxiosInstance so its methods accept CustomAxiosRequestConfig
interface CustomAxiosInstance extends AxiosInstance {
  get<T, R = AxiosResponse<T>>(
    url: string,
    config?: CustomAxiosRequestConfig,
  ): Promise<R>;
  post<T, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: CustomAxiosRequestConfig,
  ): Promise<R>;
  put<T, R = AxiosResponse<T>>(
    url: string,
    data?: unknown,
    config?: CustomAxiosRequestConfig,
  ): Promise<R>;
  delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: CustomAxiosRequestConfig,
  ): Promise<R>;
}

const createAxiosInstance = (baseURL: string): CustomAxiosInstance => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  // request interceptor
  instance.interceptors.request.use(
    (config) => {
      // add a token if it exists
      // const token = Cookies.get('token');
      // if (token) {
      //   config.headers.Authorization = `Bearer ${token}`;
      // }
      // add a language if it exists
      // const language = Cookies.get('language');
      // if (language) {
      //   config.headers['Accept-Language'] = language;
      // }
      // check content type to change header type
      if (config.data instanceof FormData) {
        config.headers.setContentType("multipart/form-data");
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const showNotification = error.config.showNotification !== false;
      const returnOnly = error.config.returnOnly === true;
      const formattedError = handleApiError(error, {
        showNotification,
        returnOnly,
      });
      return Promise.reject(formattedError);
    },
  );

  return instance;
};

export const api = createAxiosInstance(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
);
