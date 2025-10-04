// src/components/pages/BookingPage.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

import { Card } from "../ui/card";

import { Badge } from "../ui/badge";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

import {
  AlertCircle,
  Calendar,
  Clock,
  Video,
  Phone,
  Star,
  User,
  MessageCircle,
  CheckCircle2,
  Filter,
  Shield,
  Lock,
  MapPin,
  GraduationCap,
  BookOpen,
  Search,
  X,
  ArrowLeft,
  Bell,
} from "lucide-react";

import Navigation from "../shared/Navigation";

import { getTherapists, Therapist } from "../../api/services/therapists";

import {
  confirmBooking,
  bookTherapist,
  getMyBookings,
  cancelBooking,
  Booking,
} from "../../api/services/bookings";

import LoadingSpinner from "../shared/LoadingSpinner";

import { useApp } from "../../App";

// --- helpers ---
function toAmPm(hhmm24: string): string {
  if (!hhmm24) return "";
  const [hStr, mStr = "00"] = hhmm24.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${mStr} ${ampm}`;
}

function formatDatePretty(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Session topics for booking
const TOPIC_OPTIONS = [
  { label: "Self Improvement", api: "self Improvement" },
  { label: "Sexual Wellness", api: "sexual Wellness" },
  { label: "Abuse & Discrimination", api: "abuse & discrimination" },
  { label: "Academic", api: "academic" },
  { label: "Career", api: "career" },
  { label: "LGBTQIA+", api: "lgbtqia+" },
  { label: "Psychological Disorders", api: "psychological disorders" },
  { label: "Relationship", api: "relationship" },
];

// Demo tabs data (keep empty or hook to a real "my bookings" API later)
type UpcomingSession = {
  id: string;
  counselorName: string;
  date: Date;
  time: string;
  type: "video" | "phone" | "offline";
  status: "confirmed" | "pending";
  sessionType: string;
  notes?: string;
};
type PastSession = {
  id: string;
  counselorName: string;
  date: Date;
  time: string;
  type: "video" | "phone" | "offline";
  rating: number;
  sessionType: string;
  notes?: string;
  outcomes?: string[];
};
const upcomingSessions: UpcomingSession[] = [];
const pastSessions: PastSession[] = [];

export default function BookingPage() {
  const { user } = useApp() as any; // expects user?.id
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<
    "book" | "upcoming" | "history"
  >("book");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // booking UI state
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(
    null
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [apiMessage, setApiMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  // --- my bookings state ---
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loadingMy, setLoadingMy] = useState(false);

  const fetchCounselors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTherapists();
      setTherapists(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch therapists:", err);
      setError("Unable to load counselors right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCounselors();
  }, [fetchCounselors]);
  const refreshMyBookings = useCallback(async () => {
    try {
      setLoadingMy(true);
      const data = await getMyBookings();
      setMyBookings(data);
    } catch (e) {
      console.error("Failed to load my bookings:", e);
    } finally {
      setLoadingMy(false);
    }
  }, []);
  useEffect(() => {
    if (user?.id) refreshMyBookings();
  }, [user?.id, refreshMyBookings]);

  const filteredCounselors = useMemo(() => {
    if (!searchQuery.trim()) return therapists;
    const query = searchQuery.toLowerCase();
    return therapists.filter((c) => {
      const matchesName = c.name.toLowerCase().includes(query);
      const matchesSpec = c.specialization?.toLowerCase().includes(query);
      const matchesLanguages = c.languages?.some((language) =>
        language.toLowerCase().includes(query)
      );
      return matchesName || matchesSpec || matchesLanguages;
    });
  }, [searchQuery, therapists]);

  const upcoming = useMemo(
    () =>
      myBookings
        .filter((b) => b.status === "pending" || b.status === "confirmed")
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    [myBookings]
  );

  const history = useMemo(
    () =>
      myBookings
        .filter((b) => b.status === "completed" || b.status === "cancelled")
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    [myBookings]
  );

  const therapistNameById = useCallback(
    (id: string) => therapists.find((t) => t._id === id)?.name ?? "Therapist",
    [therapists]
  );

  // Create pending booking
  const handleBookingSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setApiError(null);
    setApiMessage(null);

    if (!selectedTherapist) return;
    if (!user?.id) {
      setApiError("You must be logged in to book a session.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const rawDate = form.get("date") as string;
    const rawTime = form.get("time") as string; // "HH:mm" 24h
    const uiMode = form.get("mode") as "video" | "phone" | "offline";
    const topicApi = form.get("sessionTopic") as string; // ⬅️ already the API value now

    if (!rawDate || !rawTime || !topicApi) {
      setApiError("Please choose a valid date, time, and session topic.");
      return;
    }

    // map phone -> chat (backend enum)
    const sessionType: "video" | "chat" | "offline" =
      uiMode === "phone" ? "chat" : (uiMode as "video" | "offline");

    const payload = {
      therapistId: selectedTherapist._id,
      date: rawDate, // "YYYY-MM-DD"
      time: toAmPm(rawTime), // "10:00 AM"
      sessionType,
      topic: topicApi, // ⬅️ match backend field name
    };

    try {
      setSubmitLoading(true);
      const { message, booking } = await bookTherapist(payload);
      setPendingBooking(booking);
      setApiMessage(
        message || "Booking created. Please confirm within 10 minutes."
      );
      setSelectedTherapist(null);
      // optionally refresh "my bookings" list after creation
      // await refreshMyBookings();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create booking.";
      setApiError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Confirm the pending booking
  const handleConfirm = async () => {
    if (!pendingBooking?._id) return;
    setApiError(null);
    setApiMessage(null);

    try {
      setConfirmLoading(true);
      const { message, booking } = await confirmBooking(pendingBooking._id);
      setPendingBooking(booking); // status becomes "confirmed"
      setApiMessage(message || "Booking confirmed.");
      await refreshMyBookings();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to confirm booking.";
      setApiError(msg);
    } finally {
      setConfirmLoading(false);
    }
  };

  const renderSessionIcon = (
    type: UpcomingSession["type"] | PastSession["type"]
  ) => {
    if (type === "video") return <Video className="h-3 w-3" />;
    if (type === "phone") return <Phone className="h-3 w-3" />;
    return <MapPin className="h-3 w-3" />;
  };

  const noop = () => undefined;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Professional Counselling
              </h1>
              <p className="text-sm text-muted-foreground">
                Confidential sessions with qualified therapists
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-2">
              <Shield className="h-3 w-3" />
              100% Confidential
            </Badge>
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Trust card */}
        <Card className="border-0 shadow-sm rounded-3xl bg-gradient-to-r from-blue-50 to-green-50 dark:from-sky-900/40 dark:to-emerald-900/30">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-4 space-y-4 md:space-y-0">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <Lock className="h-7 w-7" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Your Privacy is Protected
                  </h2>
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    All sessions are completely confidential. Your conversations
                    are protected by client-therapist privilege and never shared
                    without your explicit consent.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Licensed professionals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Student-focused approach</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-green-700 dark:text-green-300">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Flexible scheduling</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as typeof selectedTab)}
        >
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/60 p-1 shadow-inner">
            <TabsTrigger className="rounded-full py-2" value="book">
              Find Counselor
            </TabsTrigger>
            <TabsTrigger className="rounded-full py-2" value="upcoming">
              Upcoming ({upcoming.length})
            </TabsTrigger>
            <TabsTrigger className="rounded-full py-2" value="history">
              Session History ({history.length})
            </TabsTrigger>

            <TabsTrigger className="rounded-full py-2" value="history">
              Session History
            </TabsTrigger>
          </TabsList>

          {/* Book tab */}
          <TabsContent value="book" className="space-y-6">
            {/* Search + Filters */}
            <Card className="border-0 shadow-sm rounded-3xl bg-card dark:bg-slate-900">
              <div className="p-5 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div className="relative flex-1">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or specialization..."
                      className="h-12 w-full rounded-full border border-border bg-background px-11 pr-12 text-sm shadow-inner transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="h-12 rounded-full px-6"
                    onClick={() => setShowFilters((prev) => !prev)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl border border-dashed border-border bg-muted/40 dark:bg-slate-800/60 p-4 text-sm">
                    <div className="space-y-2">
                      <p className="font-semibold">Format</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Video</Badge>
                        <Badge variant="outline">In-person</Badge>
                        <Badge variant="outline">Phone</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Specialization</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Academic stress</Badge>
                        <Badge variant="outline">Anxiety</Badge>
                        <Badge variant="outline">Career</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">English</Badge>
                        <Badge variant="outline">Hindi</Badge>
                        <Badge variant="outline">Regional</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Results */}
            {loading ? (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-3">
                  <LoadingSpinner size="lg" />
                  <p className="text-sm text-muted-foreground">
                    Loading counselors...
                  </p>
                </div>
              </Card>
            ) : error ? (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-3">
                  <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                  <h3 className="text-lg font-semibold">
                    Something went wrong
                  </h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button onClick={fetchCounselors}>Retry</Button>
                </div>
              </Card>
            ) : filteredCounselors.length === 0 ? (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-3">
                  <User className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No counselors found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search keywords or filters to find
                    available counselors.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {filteredCounselors.map((c) => (
                  <Card
                    key={c._id}
                    className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    <div className="relative z-10 flex h-full flex-col gap-6 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/30 flex items-center justify-center shadow-inner">
                            <User className="h-8 w-8 lg:h-10 lg:w-10 text-primary" />
                            </div>
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold leading-tight text-foreground">
                                {c.name}
                              </h3>
                              <Badge className="bg-green-100 text-green-700 border-green-200 text-xs dark:bg-green-900/40 dark:text-green-300 dark:border-green-800" variant="secondary">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                              <p className="text-sm text-muted-foreground">
                              {c.specialization || 'Therapist'}
                              </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-foreground">
                                {c.rating?.toFixed(1) ?? '4.9'}
                                </span>
                              <span>•</span>
                              <span>{c.experience || 'Experienced counselor'}</span>
                              </div>
                            </div>
                          </div>

                        <div className="rounded-2xl border border-border/60 bg-muted/50 px-4 py-3 text-xs text-muted-foreground space-y-1">
                          <p className="uppercase tracking-wide text-[11px] text-muted-foreground/80">Next availability</p>
                          <p className="text-sm font-semibold text-foreground">
                            {c.availability?.[0] || 'Reach out for schedule'}
                          </p>
                          {c.languages?.length ? (
                            <div className="flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                              {c.languages.slice(0, 3).map((lang) => (
                                <span key={lang} className="inline-flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 border border-border/50">
                                  <MessageCircle className="h-3 w-3" />
                                  {lang}
                                </span>
                              ))}
                              </div>
                          ) : null}
                            </div>
                          </div>

                      <div className="grid gap-3 rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground sm:grid-cols-2">
                        <span className="inline-flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-primary" />
                          {c.education ?? 'Licensed professional'}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          {c.availability?.[1] || 'Flexible slots'}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {(c.focusAreas && c.focusAreas.slice(0, 2).join(', ')) || 'Student wellness'}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          Confidential support guaranteed
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          {c.availability?.slice(0, 3).map((slot, index) => (
                                <Badge
                              key={`${c._id}-slot-${index}`}
                                  variant="outline"
                              className="rounded-full border-border/60 text-foreground"
                                >
                                  <Clock className="h-3 w-3 mr-1" />
                                  {slot}
                                </Badge>
                              ))}
                          {(c.availability?.length ?? 0) > 3 && (
                            <span className="text-[11px] text-muted-foreground">+ more slots</span>
                          )}
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                          <Button
                            variant="outline"
                            className="border-border text-foreground hover:bg-muted/40"
                            onClick={() => navigate(`/message/${c._id}`)}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90"
                            onClick={() => {
                              setApiError(null);
                              setApiMessage(null);
                              setSelectedTherapist(c);
                            }}
                          >
                            Book Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Upcoming (demo) */}
          <TabsContent value="upcoming" className="space-y-4">
            {loadingMy ? (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-3">
                  <LoadingSpinner size="lg" />
                  <p className="text-sm text-muted-foreground">
                    Loading your bookings…
                  </p>
                </div>
              </Card>
            ) : upcoming.length > 0 ? (
              upcoming.map((b) => (
                <Card
                  key={b._id}
                  className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {therapistNameById(b.therapistId)}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {b.topic}
                          </p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDatePretty(b.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{b.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderSessionIcon(
                                b.sessionType === "chat"
                                  ? "phone"
                                  : (b.sessionType as any)
                              )}
                              <span className="capitalize">
                                {b.sessionType}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          b.status === "confirmed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                        }
                      >
                        {b.status}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-4">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">
                    No upcoming sessions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Book your first session to get started with professional
                    support.
                  </p>
                  <Button onClick={() => setSelectedTab("book")}>
                    Browse Counselors
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* History (demo) */}
          <TabsContent value="history" className="space-y-4">
            {pastSessions.length > 0 ? (
              pastSessions.map((session) => (
                <Card
                  key={session.id}
                  className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">
                            {session.counselorName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {session.sessionType}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{session.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: session.rating }).map(
                          (_, index) => (
                            <Star
                              key={`${session.id}-rating-${index}`}
                              className="h-4 w-4 text-yellow-500 fill-current"
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No session history</h3>
                  <p className="text-sm text-muted-foreground">
                    Your completed sessions will appear here.
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Help card */}
        <Card className="border-0 shadow-sm rounded-3xl bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-slate-800">
          <div className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Need Help Choosing?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Chat with Support</p>
                  <p className="text-xs text-muted-foreground">
                    Get help finding the right counselor for your needs
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Privacy Policy</p>
                  <p className="text-xs text-muted-foreground">
                    Learn about our confidentiality protections
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 left-0 right-0 z-30">
        <Navigation />
      </div>

      {/* Booking Modal */}
      {selectedTherapist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border/60 bg-card text-foreground shadow-2xl transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />
            <div className="relative p-6 space-y-5">
            <button
              className="absolute right-4 top-4 rounded-full bg-muted/50 p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={() => setSelectedTherapist(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">Book a Session</Badge>
              <h2 className="text-xl font-semibold">
              Book Session with {selectedTherapist.name}
            </h2>
              <p className="text-sm text-muted-foreground">
                Finalize the details below to reserve your session. You can change or cancel up to 24 hours beforehand.
              </p>
            </div>

            {apiError && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {apiError}
              </div>
            )}

            {!user?.id && (
              <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-600">
                Please sign in to book a session.
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">Mode</label>
                <select
                  name="mode"
                  className="w-full rounded-xl border border-border/60 bg-background/90 p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  defaultValue="video"
                  required
                >
                  <option value="video">Video</option>
                  <option value="phone">Chat (Phone/Text)</option>
                  <option value="offline">In-Person</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  * “Phone/Text” is stored as <strong>chat</strong> in the
                  system.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground">Date</label>
                  <input
                    type="date"
                    name="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-border/60 bg-background/90 p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">Time</label>
                  <input
                    type="time"
                    name="time"
                    className="w-full rounded-xl border border-border/60 bg-background/90 p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll convert to 12-hour format.
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                  Session Topic
                </label>
                <select
                  name="sessionTopic"
                  className="w-full rounded-xl border border-border/60 bg-background/90 p-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required
                >
                  <option value="">Select a topic for your session</option>
                  {TOPIC_OPTIONS.map((t) => (
                    <option key={t.api} value={t.api}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  Choose the main topic you'd like to discuss during your
                  session
                </p>
              </div>

              <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">Need a different slot?</p>
                <p>
                  Book this session now and message the counselor afterwards to adjust your timing if required. They usually respond within 12 hours.
                </p>
              </div>
 
              <div className="flex flex-wrap justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTherapist(null)}
                  type="button"
                  className="rounded-full border-border text-foreground hover:bg-muted/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                  disabled={submitLoading || !user?.id}
                >
                  {submitLoading ? "Creating…" : "Create Booking"}
                </Button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Review & Confirm */}
      {pendingBooking && (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

<Card className="bg-white dark:bg-slate-900 pointer-events-auto w-[92%] sm:w-[520px] shadow-2xl rounded-2xl">

 

          <div className="p-5 space-y-4">

            <div className="flex items-start justify-between">

              <div>

                <h3 className="text-lg font-semibold">Review & Confirm</h3>

                <p className="text-xs text-muted-foreground">

                  Booking will auto-expire if not confirmed by{" "}

                  <strong>

                    {pendingBooking.expiresAt

                      ? new Date(pendingBooking.expiresAt).toLocaleTimeString()

                      : "—"}

                  </strong>

                  .

                </p>

              </div>

              <Badge

                variant={

                  pendingBooking.status === "confirmed" ? "default" : "outline"

                }

              >

                {pendingBooking.status}

              </Badge>

            </div>




            {apiMessage && (

              <div className="text-sm text-green-600 flex items-center gap-2">

                <CheckCircle2 className="h-4 w-4" /> {apiMessage}

              </div>

            )}

            {apiError && (

              <div className="text-sm text-red-600 flex items-center gap-2">

                <AlertCircle className="h-4 w-4" /> {apiError}

              </div>

            )}



            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">

                <User className="h-4 w-4" />

                <span>

                  Therapist:{" "}

                  {therapists.find((t) => t._id === pendingBooking.therapistId)

                    ?.name || "—"}

                </span>

              </div>

              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">

                <Calendar className="h-4 w-4" />

                <span>{formatDatePretty(pendingBooking.date)}</span>

              </div>

              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">

                <Clock className="h-4 w-4" />

                <span>{pendingBooking.time}</span>

              </div>

              <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">

                {pendingBooking.sessionType === "video" ? (

                  <Video className="h-4 w-4" />

                ) : pendingBooking.sessionType === "chat" ? (

                  <Phone className="h-4 w-4" />

                ) : (

                  <MapPin className="h-4 w-4" />

                )}

                <span className="capitalize">{pendingBooking.sessionType}</span>

              </div>

            </div>



            {/* Optional: show link/location if backend returns */}

            {(pendingBooking.meetingLink || pendingBooking.location) && (

              <div className="text-xs text-muted-foreground">

                {pendingBooking.meetingLink && (

                  <div>

                    Meeting Link:{" "}

                    <span className="break-all">

                      {pendingBooking.meetingLink}

                    </span>

                  </div>

                )}

                {pendingBooking.location && (

                  <div>Location: {pendingBooking.location}</div>

                )}

              </div>

            )}



            <div className="flex justify-end gap-2">

              <Button variant="outline" onClick={() => setPendingBooking(null)}>

                Close

              </Button>



              <Button

                variant="outline"

                onClick={async () => {

                  if (!pendingBooking?._id) return;

                  try {

                    setConfirmLoading(true);

                    await cancelBooking(pendingBooking._id);

                    setApiMessage("Booking cancelled.");

                    await refreshMyBookings();

                    setPendingBooking(null);

                  } catch (err: any) {

                    const msg =

                      err?.response?.data?.message ||

                      "Failed to cancel booking.";

                    setApiError(msg);

                  } finally {

                    setConfirmLoading(false);

                  }

                }}

              >

                Cancel Booking

              </Button>



              <Button

                onClick={handleConfirm}

                disabled={

                  pendingBooking.status === "confirmed" || confirmLoading

                }

                className="bg-primary"

              >

                {pendingBooking.status === "confirmed"

                  ? "Confirmed"

                  : confirmLoading

                  ? "Confirming…"

                  : "Confirm Now"}

              </Button>

            </div>

          </div>

        </Card>

        </div>



       )}

    </div>

  );
}
