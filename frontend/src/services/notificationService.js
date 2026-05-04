import axiosClient from "./api/axiosClient";

export const getMyNotifications = async () => {
  const response = await axiosClient.get("/notifications");
  return response.data;
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await axiosClient.patch(
    `/notifications/${notificationId}/read`
  );
  return response.data;
};

export const moveNotificationToTrash = async (notificationId) => {
  const response = await axiosClient.delete(`/notifications/${notificationId}`);
  return response.data;
};
