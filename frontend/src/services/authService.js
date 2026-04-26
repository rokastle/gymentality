import axiosClient from "./api/axiosClient";

export async function registerUser(payload) {
  const response = await axiosClient.post("/auth/register", payload);
  return response.data;
}

export async function loginUser(payload) {
  const response = await axiosClient.post("/auth/login", payload);
  return response.data;
}

export async function getMe() {
  const response = await axiosClient.get("/auth/me");
  return response.data;
}

export async function updateProfile(payload) {
  const response = await axiosClient.put("/auth/me/profile", payload);
  return response.data;
}

export async function updatePaymentMethod(payload) {
  const response = await axiosClient.put("/auth/me/payment-method", payload);
  return response.data;
}

export async function updateEmail(payload) {
  const response = await axiosClient.put("/auth/me/email", payload);
  return response.data;
}

export async function updatePassword(payload) {
  const response = await axiosClient.put("/auth/me/password", payload);
  return response.data;
}