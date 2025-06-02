import axios from "axios";

const API_URL = "http://localhost:3000"; // Replace with your NestJS backend URL

export const getAvailableSlots = async (date, counselorId) => {
  const res = await axios.get(`${API_URL}/api/available-slots`, {
    params: { date, counselorId },
  });
  return res.data;
};

export const createBooking = async ({ clientId, scheduleId }) => {
  const res = await axios.post(`${API_URL}/bookings`, {
    clientId,
    scheduleId,
  });
  return res.data;
};
