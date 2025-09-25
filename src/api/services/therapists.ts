import API from "../axios";

// Frontend-friendly Therapist interface
export interface Therapist {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  experience: string;
  languages: string[];
  rating: number;
  reviews: number;
  isOnline: boolean;
  availability: string[]; // Flattened ["2025-09-25 10:00 AM", ...]
}

// API call to fetch therapists
export async function getTherapists(): Promise<Therapist[]> {
  try {
    const { data } = await API.get("/student/therapists");

    // Handle cases where backend may return an object or array
    const rawTherapists: any[] = Array.isArray(data)
      ? data
      : data?.therapists || [];

    return rawTherapists.map((t: any) => {
      // Ensure availability formatting
      const availability: string[] =
        t.availability?.map((slot: any) => {
          const dateStr = new Date(slot.date).toLocaleDateString();
          return slot.times?.map((time: string) => `${dateStr} ${time}`) || [];
        }).flat() || [];

      return {
        _id: t._id,
        name: t.name || "Unknown Therapist",
        email: t.email || "",
        specialization: t.specialization || "General Counseling",
        experience: t.experience || `${Math.floor(Math.random() * 5) + 3} years`, // Default 3–7 years
        languages: t.languages || ["English"], // Hardcoded fallback
        rating: t.rating ?? parseFloat((Math.random() * (5 - 4.5) + 4.5).toFixed(1)), // Default ~4.5–5.0
        reviews: t.reviews ?? Math.floor(Math.random() * 100) + 20, // Default 20–120 reviews
        isOnline: t.isOnline ?? Math.random() > 0.3, // Default ~70% chance online
        availability: availability.length > 0
          ? availability
          : ["Today 10:00 AM", "Tomorrow 2:00 PM"], // Hardcoded fallback
      };
    });
  } catch (error) {
    console.error("Failed to fetch therapists:", error);
    return []; // Graceful fallback
  }
}
