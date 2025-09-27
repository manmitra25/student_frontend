import API from "../axios";



export interface Booking {

 _id: string;

 studentId: string;

 therapistId: string;

 date: string;      // ISO date

 time: string;      // "HH:MM AM/PM"

 sessionType: "video" | "chat" | "offline" | "call"; // backend allows "call" too

 status: "pending" | "confirmed" | "cancelled" | "completed";

 expiresAt?: string;

 bookedAt: string;

 meetingLink?: string;

 location?: string;

 topic: string;     // ⬅️ add this

}



export async function bookTherapist(payload: {

 therapistId: string;

 date: string;      // "YYYY-MM-DD"

 time: string;      // "HH:MM AM/PM"

 sessionType: "video" | "chat" | "offline" | "call";

 topic: string;     // ⬅️ backend requires this

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



export async function cancelBooking(bookingId: string): Promise<{ message: string; booking: Booking }> {

 const { data } = await API.post<{ message: string; booking: Booking }>(

  "/bookings/cancel",

  { bookingId }

 );

 return data;

}



/** Prefer auth’d “me” endpoint (protect uses token) */

export async function getMyBookings(): Promise<Booking[]> {

 const { data } = await API.get<{ bookings: Booking[] }>("/bookings/me");

 return data.bookings;

}



/** If you still need public-by-id: */

export async function getStudentBookings(studentId: string): Promise<Booking[]> {

 const { data } = await API.get<{ bookings: Booking[] }>(`/bookings/student/${studentId}`);

 return data.bookings;

}



// small helper

export function isActive(b: Booking) {

 return b.status === "pending" || b.status === "confirmed";

}

