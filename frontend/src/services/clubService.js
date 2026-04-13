import axiosClient from './api/axiosClient';

export const getAllClubs = async () => {
  const response = await axiosClient.get('/clubs');
  return response.data;
};

export const getClubById = async (id) => {
  const response = await axiosClient.get(`/clubs/${id}`);
  return response.data;
};