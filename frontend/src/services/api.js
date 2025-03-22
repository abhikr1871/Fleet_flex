import axios from "axios";

// Set up the base URL for the backend API
const API = axios.create({ baseURL: "http://localhost:4000/api" });

// Add a request interceptor to include the token in headers if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication routes
export const signup = (userData) => API.post("/users/signup", userData);
export const login = (userData) => API.post("/users/login", userData);
export const signup2 = (userData) =>
  API.post("/captain/captain_sign_up", userData);
export const login2 = (userData) =>
  API.post("/captain/captain_login", userData);

// Vehicle routes
export const getCaptainVehicles = () => API.get("/captain/vehicles");
export const addCaptainVehicle = (vehicleData) =>
  API.post("/captain/add_vehicle", vehicleData);

// New route for updating vehicle status (for "Go Live" or "Go Offline")
export const updateVehicleStatus = (vehicleId, statusData) =>
  API.patch(`/captain/update_vehicle_status/${vehicleId}`, statusData);

export const delete_vehicle = (vehicleId, statusData) =>
  API.patch(`/captain/delete_vehicle/${vehicleId}`, statusData);

export default {
  signup,
  login,
  signup2,
  login2,
  getCaptainVehicles,
  addCaptainVehicle,
  updateVehicleStatus,
  delete_vehicle,
};
