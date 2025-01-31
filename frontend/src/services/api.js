import axios from 'axios';

// Set up the base URL for the backend API
const API = axios.create({ baseURL: 'http://localhost:4000/api' });

// Add a request interceptor to include the token in headers if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
export const signup = (userData) => API.post('/users/signup', userData);
export const login = (userData) => API.post('/users/login', userData);
export const signup2 = (userData) => API.post("/captain/captain_sign_up", userData);
export const login2 = (userData) => API.post("/captain/captain_login", userData);

export const getCaptainVehicles = () => API.get("/captain/vehicles");
export const addCaptainVehicle = (vehicleData) =>
  API.post("/captain/add_vehicle", vehicleData);

export default {
  signup,
  login,
  signup2,
  login2,
  getCaptainVehicles,
  addCaptainVehicle,
};