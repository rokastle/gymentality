import axiosClient from "./api/axiosClient";

export const getAllWorkoutPlans = async () => {
  const response = await axiosClient.get("/workout-plans");
  return response.data;
};

export const getWorkoutPlanById = async (id) => {
  const response = await axiosClient.get(`/workout-plans/${id}`);
  return response.data;
};