import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL + "/api/assignment",
});

export const getAllAssignments = () => API.get("/");
export const getAssignmentById = (id) => API.get(`/${id}`);
export const createAssignment = (data) => API.post("/", data);
export const updateAssignment = (id, data) => API.put(`/${id}`, data);
export const deleteAssignment = (id) => API.delete(`/${id}`);
