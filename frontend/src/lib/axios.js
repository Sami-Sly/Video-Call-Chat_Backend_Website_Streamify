import axios from "axios";
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

// Create a custom Axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies in requests (for sessions/auth)
});
