// frontend/src/apiClient.ts
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://anybus-bus-booking-dev-cus-fun.azurewebsites.net';

export type SearchParams = { from: string; to: string; date: string };

export async function searchBuses(params: SearchParams) {
    const res = await axios.get(`${API_BASE}/api/search`, { params });
    return res.data;
}

export async function holdSeats(payload: { scheduleId: number; seatIds: number[]; holdForSeconds?: number }) {
    const res = await axios.post(`${API_BASE}/api/hold`, payload);
    return res.data;
}

export async function bookSeats(payload: { holdId: string; customer: { name: string, email: string } }) {
    const res = await axios.post(`${API_BASE}/api/book`, payload);
    return res.data;
}

export async function cancelBooking(bookingId: string) {
    const res = await axios.post(`${API_BASE}/api/cancel`, { bookingId });
    return res.data;
}
