import axiosClient from './api/axiosClient';

export const getAllClasses = async () => {
  const response = await axiosClient.get('/classes');
  return response.data;
};

export const getClassById = async (id) => {
  const response = await axiosClient.get(`/classes/${id}`);
  return response.data;
};