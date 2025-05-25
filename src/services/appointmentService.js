import axiosInstance from "../util/axiosInstance";

export const fetchPendingAppointments = async (hostId) => {
  const res = await axiosInstance.get(`/appointments/host/${hostId}/pending`);
  return res.data;
};

export const updateAppointmentStatus = async (id, updateData) => {
  const res = await axiosInstance.put(`appointments/status/${id}`, updateData);
  return res.data;
};

export const fetchConfirmedAppointments = async (hostId) => {
  const res = await axiosInstance.get(`/appointments/host/${hostId}/confirmed`);
  return res.data;
};
