import axiosInstance from "../util/axiosInstance";

export const fetchPendingAppointments = async (hostId) => {
  const res = await axiosInstance.get(`/appointments/host/${hostId}/pending`);
  return res.data;
};
