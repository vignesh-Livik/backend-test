import axios from "axios";

// Backend API base
const API_BASE = "http://localhost:3000/api";

// GET all users with personal details
export const getAllUsers = async () => {
  const response = await axios.get(`${API_BASE}/users/personal-details`);
  return response.data;
};

// GET single user profile
export const getUserProfile = async (userId) => {
  const response = await axios.get(`${API_BASE}/users/${userId}/personal-details`);
  return response.data;
};

// CREATE personal details
export const createPersonalDetails = async (userId, data) => {
  const response = await axios.post(`${API_BASE}/users/${userId}/personal-details`, data);
  return response.data;
};

// UPDATE personal details
export const updatePersonalDetails = async (userId, data) => {
  const response = await axios.put(`${API_BASE}/users/${userId}/personal-details`, data);
  return response.data;
};

// DELETE personal details
export const deletePersonalDetails = async (userId) => {
  const response = await axios.delete(`${API_BASE}/users/${userId}/personal-details`);
  return response.data;
};
