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

export const search_vehicles = (searchQuery) =>
  API.post(`/captain/search_vehicles`, searchQuery);

export const getProfile = () => API.get("/users/profile");
export const updateProfileImage = (imageData) =>
  API.post("/users/update-profile-image", imageData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateUsername = (usernameData) =>
  API.put("/users/update-username", usernameData);

export const getCaptainProfile = () => API.get("/captain/profile");
export const updateCaptainProfileImage = (imageData) =>
  API.post("/captain/update-profile-image", imageData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateCaptainUsername = (usernameData) =>
  API.put("/captain/update-username", usernameData);

export const createBooking = (bookingData) => {
  const token = localStorage.getItem("token"); // adjust key if needed
  return API.post("/bookings", bookingData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all ride requests for the captain
export const getCaptainRideRequests = () => API.get("/captain/ride-requests");
// Respond to a ride request (accept or reject)
export const respondToRideRequest = (bookingId, status) =>
  API.patch(`/bookings/${bookingId}`, { status });

export const getUpcomingRides = () => API.get("/users/upcoming-rides");

export const getChatHistory = () => API.get("/chat-history");
export const getChatMessages = (senderId, receiverId) =>
  API.get(`/messages/${senderId}/${receiverId}`);
export default {
  // Auth exports
  signup,
  login,
  signup2,
  login2,
  // Profile exports
  getProfile,
  updateProfileImage,
  updateUsername,
  // Vehicle exports
  getCaptainVehicles,
  addCaptainVehicle,
  updateVehicleStatus,
  delete_vehicle,
  search_vehicles,
  // Captain exports
  getCaptainProfile,
  updateCaptainProfileImage,
  updateCaptainUsername,
  // Booking export
  createBooking,
  getCaptainRideRequests,
  respondToRideRequest,
  getUpcomingRides,
};
