import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/appointment"; // Backend base URL

// Faculty and department structure as requested - keeping as fallback
const facultyDepartmentStructure = {
  "IT": ["CM", "IT", "IDS"],
  "Engineering": ["Electronic", "Mechanical", "Civil"],
  "Architecture": ["FM", "Design", "Architecture"]
};

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


// Function to get all hosts with faculty and department information
export const getAllHosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/gethosts`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    // Return the host data from the backend with faculty and department info
    return response.data;
  } catch (error) {
    console.error("Error fetching hosts:", error);
    throw error;
  }
};

// Function to get all faculties
export const getAllFaculties = async () => {
  try {
    // Get faculties from the backend instead of using the static structure
    const response = await axios.get(`${API_BASE_URL}/faculties`);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    // Fallback to static data if the API fails
    console.log("Using fallback faculty data");
    return Object.keys(facultyDepartmentStructure);
  }
};

// Function to get departments for a specific faculty
export const getDepartmentsByFaculty = async (faculty) => {
  try {
    if (!faculty) {
      return [];
    }
    // Get departments from the backend for the selected faculty
    const response = await axios.get(`${API_BASE_URL}/departments/${faculty}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    // Fallback to static data if the API fails
    console.log("Using fallback department data");
    return faculty && facultyDepartmentStructure[faculty] ? facultyDepartmentStructure[faculty] : [];
  }
};

// Function to get hosts by faculty and department
export const getHostsByFacultyAndDepartment = async (faculty, department) => {
  try {
    const facultyParam = faculty || 'all';
    const departmentParam = department || 'all';
    
    const response = await axios.get(`${API_BASE_URL}/hosts/${facultyParam}/${departmentParam}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching hosts by faculty and department:", error);
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

export const selectTimeSlot = async (appointmentId, slotId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/selectTimeSlot/${appointmentId}`, {
      slotId
    });
    return response.data;
  } catch (error) {
    console.error("Error selecting time slot:", error);
    throw error;
  }
};


