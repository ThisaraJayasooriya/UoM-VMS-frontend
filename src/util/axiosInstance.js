import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Change port if needed
  withCredentials: true, // if you're using cookies for auth
});

export default axiosInstance;
