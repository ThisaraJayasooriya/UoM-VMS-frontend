import axiosInstance from "../util/axiosInstance";

export const reportBadVisitor = async (report) => {
  try {
    const response = await axiosInstance.post("appointments/reportVisitor", report);
    return response.data;
  } catch (error) {
    console.error("Error reporting bad visitor:", error);
    throw error;
  }
}
