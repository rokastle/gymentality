import axiosClient from './api/axiosClient';

export const getAllFacilities = async () => {
  const response = await axiosClient.get('/facilities');
  return response.data;
};

export const getFacilityById = async (id) => {
  const response = await axiosClient.get(`/facilities/${id}`);
  return response.data;
};