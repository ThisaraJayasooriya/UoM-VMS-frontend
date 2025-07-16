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

export const fetchLastVisitLog = async (userId) => {
  try {
    const response = await axiosInstance.get(`/userLog/lastVisit/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching last visit log:", error);
    // Return a default object if API endpoint doesn't exist or fails
    return { 
      lastVisitDate: null,
      lastVisitTime: null
    };
  }
};

export const updateLastVisitLog = async (userId) => {
  try {
    // Current date and time
    const visitData = {
      userId: userId,
      lastVisitDate: new Date()
    };
    
    const response = await axiosInstance.post('/userLog/updateLastVisit', visitData);
    return response.data;
  } catch (error) {
    console.error("Error updating last visit log:", error);
    // Still return the current date even if API fails
    return { 
      lastVisitDate: new Date(),
      success: false
    };
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {

    console.log("Sending profile update to API for userId:", userId);
    const response = await axiosInstance.put(`/userProfile/${userId}`, profileData);
    console.log("API response:", response.data);
    

    if (response.data && response.data.success) {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const updatedUserData = { ...userData, ...profileData };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
    }
    
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    
    // For development/testing without backend
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.warn("API call failed, using localStorage for development");
      
      // Update localStorage for testing
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const updatedUserData = { ...userData, ...profileData };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      
      return {
        success: true,
        message: "Profile updated successfully (Mock)",
        user: updatedUserData
      };
    }
    
    throw error;
  }
};

