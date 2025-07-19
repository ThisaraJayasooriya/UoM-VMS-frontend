import axiosInstance from "../util/axiosInstance";

export const fetchAllAppointments = async (hostId) => {
  const res = await axiosInstance.get(`/appointments/host/${hostId}/all`);
  return res.data;
};

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

export const fetchPendingAppointmentsCount = async (hostId) => {
  const res = await axiosInstance.get(`/appointments/host/${hostId}/pendingcount`);
  return res.data;
};

export const fetchAcceptedAppointmentsCount = async (hostId) => {
  const res = await axiosInstance.get(`/appointments/host/${hostId}/confirmedcount`);
  return res.data;
};

export const rescheduleAppointment = async (appointmentId, rescheduleData) => {
  const res = await axiosInstance.put(`/appointments/reschedule/${appointmentId}`, rescheduleData);
  return res.data;
};

export const cancelAppointment = async (appointmentId) => {
  const res = await axiosInstance.put(`/appointments/cancel/${appointmentId}`);
  return res.data;
};
