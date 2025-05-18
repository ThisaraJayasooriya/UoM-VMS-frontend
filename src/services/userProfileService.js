import axiosInstance from "../util/axiosInstance";

export const fetchHostProfile = async (id) => {
  try {
    const response = await axiosInstance.get(`/userProfile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching host profile:", error);
    throw error;
  }
};

export const fetchUserProfile = async (id) => {
  try {
    const response = await axiosInstance.get(`/userProfile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching User profile:", error);
    throw error;
  }
};