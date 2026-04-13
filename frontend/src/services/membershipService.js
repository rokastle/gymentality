import axiosClient from './api/axiosClient';

export const getAllMemberships = async () => {
  const response = await axiosClient.get('/memberships');
  return response.data;
};

export const getMembershipById = async (id) => {
  const response = await axiosClient.get(`/memberships/${id}`);
  return response.data;
};