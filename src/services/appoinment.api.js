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


// Function to get all hosts
export const getAllHosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gethosts`, {
      headers: {
        "Content-Type": "application/json", // Optional with Axios
      },
    });
    return response.data; // Returns array of host objects
  } catch (error) {
    console.error("Error fetching hosts:", error);
    throw error;
  }
};

export const getAcceptedAppointment = async (visitorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/acceptedAppointment/${visitorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching accepted appointment:", error);
    throw error;
  }
};

export const confirmAppointment = async (appointmentId) => {
  console.log("Appointment confirmed:", appointmentId);
  try {
    const response = await axios.put(`${API_BASE_URL}/confirmAppointment/${appointmentId}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    throw error;
  } 
  };

export const rejectAppointment = async (appointmentId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/rejectappointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting appointment:", error);
    throw error;
  }
};

export const getAppointmentStatus = async (visitorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/appointmentStatus/${visitorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching confirmed appointments:", error);
    throw error;
  }
};


