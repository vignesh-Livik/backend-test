import axios from 'axios';

export const BACKEND_URL = 'http://localhost:3000';
export const API = axios.create({
    baseURL: 'http://localhost:3001',
});

