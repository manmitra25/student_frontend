import API from "../axios";

export interface Booking {
  _id: string;
  studentId: string;
  therapistId: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  expiresAt?: string;
}

export async function bookTherapist(payload: { studentId: string; therapistId: string; time: string }) {
  const { data } = await API.post<{ message: string; booking: Booking }>("/bookings/book", payload);
  return data;
}

export async function confirmBooking(bookingId: string) {
  const { data } = await API.post<{ message: string; booking: Booking }>("/bookings/confirm", { bookingId });
  return data;
}
