import axios from "axios";

const API_URL = "http://localhost:5000/api/host"; // Backend URL

// Function to add a new time slot
export const addTimeSlots = async (hostId, date, startTime, endTime, status = "available") => {
    try {
        const response = await axios.post(`${API_URL}/add-availability`, { 
            hostId, 
            date, 
            startTime, 
            endTime, 
            status 
        });
        return response.data;
    } catch (error) {
        console.error("Error adding time slot:", error);
        throw error;
    }
};

// Function to get time slots for a specific host
export const getTimeSlots = async (hostId) => {
    try {
        const response = await axios.get(`${API_URL}/${hostId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching time slots:", error);
        throw error;
    }
};

// Function to delete a time slot
export const deleteTimeSlot = async (slotId) => {
    try {
        const response = await axios.delete(`${API_URL}/${slotId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting time slot:", error);
        throw error;
    }
};