import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL + "/api/users",
});

/* ================= USERS API ================= */

// GET ALL USERS
export const getAllUsers = () => API.get("/");

// GET ALL USER BY ID
export const getUserById = (id) => API.get(`/${id}`);

// CREATE USER
export const createUser = (data) => API.post("/", data);

// UPDATE USER
export const updateUser = (userId, data) => API.put(`/${userId}`, data);

// DELETE USER
export const deleteUser = (userId) => API.delete(`/${userId}`);
