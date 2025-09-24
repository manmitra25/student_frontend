import API from "../axios";

export interface Therapist {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  experience: string; // frontend default if backend doesn't provide
  languages: string[]; // frontend default
  rating: number;      // frontend default
  reviews: number;     // frontend default
  isOnline: boolean;   // frontend default
  availability: string[]; // frontend default
}

export async function getTherapists(): Promise<Therapist[]> {
  const { data } = await API.get<any>("/student/therapists");

  // normalize response
  const rawTherapists: any[] = Array.isArray(data) ? data : data?.therapists || [];

  // map backend data to frontend Therapist interface with defaults
  return rawTherapists.map(t => ({
    _id: t._id,
    name: t.name,
    email: t.email,
    specialization: t.specialization || "General Counseling",
    experience: t.experience || `${Math.floor(Math.random() * 10) + 3} years`, // random 3-12 yrs if missing
    languages: t.languages || ["English"], 
    rating: t.rating ?? (Math.random() * (5 - 4.5) + 4.5), // random 4.5 - 5
    reviews: t.reviews ?? Math.floor(Math.random() * 100) + 20, 
    isOnline: t.isOnline ?? true,
    availability: t.availability || ["Today 10:00 AM", "Tomorrow 2:00 PM"]
  }));
}
