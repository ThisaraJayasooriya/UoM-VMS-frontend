import axiosInstance from "../util/axiosInstance";

export const fetchUserProfile = async (id) => {
  try {
    const response = await axiosInstance.get(`/userProfile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};