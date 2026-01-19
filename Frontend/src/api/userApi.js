import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/user", // backend runs on 3000
});

/* ================= USERS API ================= */

// GET ALL USERS
export const getAllUsers = () => API.get("/get-users");

// CREATE USER
export const createUser = (data) => API.post("/create-user", data);

// UPDATE USER
export const updateUser = (userId, data) => API.put(`/users/${userId}`, data);

// DELETE USER
export const deleteUser = (userId) => API.delete(`/users/${userId}`);
