import { api } from "./api";
import { toast } from "react-toastify";

export const signupUserClient = async (data: {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}) => {
  const response = await api.post("/auth/signup", data, {
    showNotification: false,
  });
  return response.data;
};

export const signinUserClient = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/auth/signin", data, {
    showNotification: false,
  });
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/auth/signout");
  const data = response.data as { message: string };
  toast.success(data.message);
};

export const forgetPassword = async (data: { email: string }) => {
  const response = await api.post("/auth/forget-password", data, {
    showNotification: false,
  });
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string }) => {
  const response = await api.post("/auth/verify-otp", data, {
    showNotification: false,
  });
  return response.data;
};

export const resetPassword = async (data: {
  newPassword: string;
  token: string;
  email?: string;
}) => {
  const response = await api.post("/auth/reset-password", data, {
    showNotification: false,
  });
  return response.data;
};
