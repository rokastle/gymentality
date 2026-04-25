import axiosClient from "./api/axiosClient";

export const getClassSchedule = async (date) => {
  const response = await axiosClient.get("/classes/schedule", {
    params: { date },
  });
  return response.data;
};

export const createBooking = async (payload) => {
  const response = await axiosClient.post("/bookings", payload);
  return response.data;
};

export const cancelBooking = async (payload) => {
  const response = await axiosClient.post("/bookings/cancel", payload);
  return response.data;
};

export const getMyUpcomingBookings = async () => {
  const response = await axiosClient.get("/bookings/me/upcoming");
  return response.data;
};

export const requestClassAvailabilityNotification = async (
  clubClassId,
  classDate
) => {
  const response = await axiosClient.post(`/classes/${clubClassId}/notify`, {
    classDate,
  });
  return response.data;
};