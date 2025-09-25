import API from "../axios";

export interface Booking {
  _id: string;
  studentId: string;
  therapistId: string;
  date: string;
  time: string;
  sessionType: "video" | "chat" | "offline";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  expiresAt?: string;
  bookedAt: string;
  meetingLink?: string;
  location?: string;
}

export async function bookTherapist(payload: {
  // studentId: string;
  therapistId: string;
  date: string;
  time: string;
  sessionType: "video" | "chat" | "offline";
}): Promise<{ message: string; booking: Booking }> {
  const { data } = await API.post<{ message: string; booking: Booking }>(
    "/bookings/book",
    payload
  );
  return data;
}

export async function confirmBooking(bookingId: string): Promise<{ message: string; booking: Booking }> {
  const { data } = await API.post<{ message: string; booking: Booking }>(
    "/bookings/confirm",
    { bookingId }
  );
  return data;
}

export async function getStudentBookings(studentId: string): Promise<Booking[]> {
  const { data } = await API.get<{ bookings: Booking[] }>(
    `/bookings/student/${studentId}`
  );
  return data.bookings;
}

// small helper
export function isActive(b: Booking) {
  return b.status === "pending" || b.status === "confirmed";
}
