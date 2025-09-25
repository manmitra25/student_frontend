import API from "../axios";

// Match your backend Booking schema
export interface Booking {
  _id: string;
  studentId: string;
  therapistId: string;
  date: string;              // ISO date
  time: string;              // "10:00 AM"
  sessionType: "video" | "chat" | "offline";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  expiresAt?: string;
  bookedAt: string;
  meetingLink?: string;
  location?: string;
}

// --- Book Therapist Session ---
export async function bookTherapist(payload: {
  studentId: string;
  therapistId: string;
  date: string;        // from date picker (YYYY-MM-DD or ISO string)
  time: string;        // from time picker ("10:00 AM")
  sessionType: "video" | "chat" | "offline";
}) {
  const { data } = await API.post<{ message: string; booking: Booking }>(
    "/bookings/book",
    payload
  );
  return data;
}

// --- Confirm Booking ---
export async function confirmBooking(bookingId: string) {
  const { data } = await API.post<{ message: string; booking: Booking }>(
    "/bookings/confirm",
    { bookingId }
  );
  return data;
}

// --- Get All Bookings for Student ---
export async function getStudentBookings(studentId: string) {
  const { data } = await API.get<{ bookings: Booking[] }>(
    `/bookings/student/${studentId}`
  );
  return data.bookings;
}

// --- Get All Bookings for Therapist (useful for therapist dashboard) ---
export async function getTherapistBookings(therapistId: string) {
  const { data } = await API.get<{ bookings: Booking[] }>(
    `/bookings/therapist/${therapistId}`
  );
  return data.bookings;
}
