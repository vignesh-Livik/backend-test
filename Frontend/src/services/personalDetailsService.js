import axios from "axios";

// const API_BASE_URL = "http://localhost:3000";
 const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

export const getAllUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/personal`);
  return response.data;
};

export const getUserProfile = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/api/personal/${userId}`);
  return response.data;
};

export const createPersonalDetails = async (userId, data) => {
  const response = await axios.post(`${API_BASE_URL}/api/personal/${userId}`, data);
  return response.data;
};

export const updatePersonalDetails = async (userId, data) => {
  const response = await axios.put(`${API_BASE_URL}/api/personal/${userId}`, data);
  return response.data;
};

// DELETE personal details
export const deletePersonalDetails = async (userId) => {
  const response = await axios.delete(`${API_BASE_URL}/api/personal/${userId}`);
  return response.data;
};
