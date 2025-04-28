import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/appointment"; // Backend base URL

export const makeAppointment = async (appointmentData) => {
    console.log("Appointment Data:", appointmentData); // Log the data being sent
  try {
    const response = await axios.post(
      `${API_BASE_URL}/createAppointment`,
      appointmentData, // <-- This gets automatically converted to JSON
      {
        headers: {
          "Content-Type": "application/json", // Optional: axios does this automatically
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error making appointment:", error);
    throw error;
  }
};
