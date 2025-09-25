import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  AlertCircle,
  Calendar,
  Clock,
  Video,
  Phone,
  Star,
  User,
  Languages,
  MessageCircle,
  CheckCircle2,
  Filter,
  Brain,
  Shield,
  Lock,
  UserCheck,
  MapPin,
  GraduationCap,
  BookOpen,
  Search,
} from 'lucide-react';
import Navigation from '../shared/Navigation';
import { getTherapists, Therapist } from '../../api/services/therapists';
import LoadingSpinner from '../shared/LoadingSpinner';

type UpcomingSession = {
  id: string;
  counselorName: string;
  date: Date;
  time: string;
  type: 'video' | 'phone' | 'offline';
  status: 'confirmed' | 'pending';
  sessionType: string;
  notes?: string;
};

type PastSession = {
  id: string;
  counselorName: string;
  date: Date;
  time: string;
  type: 'video' | 'phone' | 'offline';
  rating: number;
  sessionType: string;
  notes?: string;
  outcomes?: string[];
};

const upcomingSessions: UpcomingSession[] = [
  {
    id: 'upcoming-1',
    counselorName: 'Dr. Priya Sharma',
    date: new Date('2024-01-20'),
    time: '3:00 PM',
    type: 'video',
    status: 'confirmed',
    sessionType: 'Initial Consultation',
    notes: 'Anxiety management and study strategies',
  },
];

const pastSessions: PastSession[] = [
  {
    id: 'past-1',
    counselorName: 'Dr. Arjun Reddy',
    date: new Date('2024-01-15'),
    time: '2:00 PM',
    type: 'video',
    rating: 5,
    sessionType: 'Follow-up Session',
    notes: 'Great session on managing exam anxiety',
    outcomes: ['Learned breathing techniques', 'Created study schedule', 'Mood improvement noted'],
  },
];

export default function BookingPage() {
  const [selectedTab, setSelectedTab] = useState<'book' | 'upcoming' | 'history'>('book');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounselors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTherapists();
      setTherapists(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch therapists:', err);
      setError('Unable to load counselors right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCounselors();
  }, [fetchCounselors]);

  const filteredCounselors = useMemo(() => {
    if (!searchQuery.trim()) {
      return therapists;
    }

    const query = searchQuery.toLowerCase();
    return therapists.filter((counselor) => {
      const matchesName = counselor.name.toLowerCase().includes(query);
      const matchesSpec = counselor.specialization?.toLowerCase().includes(query);
      const matchesLanguages = counselor.languages?.some((language) => language.toLowerCase().includes(query));

      return matchesName || matchesSpec || matchesLanguages;
    });
  }, [searchQuery, therapists]);

  const renderSessionIcon = (type: UpcomingSession['type'] | PastSession['type']) => {
    if (type === 'video') {
      return <Video className="h-3 w-3" />;
    }

    if (type === 'phone') {
      return <Phone className="h-3 w-3" />;
    }

    return <MapPin className="h-3 w-3" />;
  };

  const noop = () => undefined;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Professional Counselling</h1>
          <p className="text-sm text-muted-foreground">
            Confidential sessions with qualified therapists
          </p>
        </div>

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
                    All sessions are completely confidential. Your conversations are protected by client-therapist privilege and never shared without your explicit consent.
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

        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as typeof selectedTab)}>
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/60 p-1 shadow-inner">
            <TabsTrigger className="rounded-full py-2" value="book">
              Find Counselor
            </TabsTrigger>
            <TabsTrigger className="rounded-full py-2" value="upcoming">
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger className="rounded-full py-2" value="history">
              Session History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="space-y-6">
            <Card className="border-0 shadow-sm rounded-3xl bg-card dark:bg-slate-900">
              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
                  <div className="relative flex-1">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search by name or specialization..."
                      className="w-full rounded-full border border-border bg-background px-14 py-3 text-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <Button variant="outline" className="rounded-full px-6" onClick={() => setShowFilters((prev) => !prev)}>
                    <Filter className="h-4 w-4 mr-2" />
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

            {loading ? (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-3">
                  <LoadingSpinner size="lg" />
                  <p className="text-sm text-muted-foreground">Loading counselors...</p>
                </div>
              </Card>
            ) : error ? (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-3">
                  <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
                  <h3 className="text-lg font-semibold">Something went wrong</h3>
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
                    Try adjusting your search keywords or filters to find available counselors.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {filteredCounselors.map((counselor) => (
                  <Card key={counselor._id} className="border border-border/60 shadow-sm bg-card dark:bg-slate-900 rounded-3xl h-full">
                    <div className="flex flex-col h-full p-6 space-y-6">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row md:items-start md:gap-4">
                          <div className="flex items-start gap-4 md:flex-col md:items-start">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                              <User className="h-10 w-10 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold leading-tight">{counselor.name}</h3>
                                {counselor.isOnline && <UserCheck className="h-4 w-4 text-green-600" />}
                              </div>
                              <p className="text-sm text-muted-foreground">{counselor.specialization || 'Counselor'}</p>
                              <div className="mt-3 flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{counselor.rating?.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({counselor.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4">
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Languages</p>
                              <div className="flex flex-wrap gap-2">
                                {(counselor.languages || ['English']).map((language) => (
                                  <Badge key={language} variant="outline" className="text-xs">
                                    {language}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 text-xs text-muted-foreground sm:grid-cols-2">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-3 w-3" />
                                <span>{counselor.experience || 'Experience shared during consultation'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Brain className="h-3 w-3" />
                                <span>{counselor.specialization || 'Holistic counseling'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{counselor.availability?.[0] || 'Flexible availability'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Languages className="h-3 w-3" />
                                <span>{counselor.languages?.join(', ') || 'English'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium">Next Available:</p>
                          <p className="text-sm text-green-600 dark:text-green-400">{counselor.availability?.[0] || 'Contact for schedule'}</p>
                          {counselor.availability && counselor.availability.length > 1 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {counselor.availability.slice(0, 3).map((slot, index) => (
                                <Badge key={`${counselor._id}-${index}`} variant="outline" className="text-xs">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {slot}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                          <Button>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button className="bg-primary hover:bg-primary/90" onClick={noop}>
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

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <Card key={session.id} className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                  <div className="p-6 space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{session.counselorName}</h3>
                          <p className="text-sm text-muted-foreground">{session.sessionType}</p>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{session.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{session.time}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderSessionIcon(session.type)}
                              <span className="capitalize">{session.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        {session.status}
                      </Badge>
                    </div>

                    {session.notes && (
                      <div className="p-3 rounded-lg bg-blue-50 text-sm text-blue-800 dark:bg-blue-900/40 dark:text-blue-100">
                        <strong>Session focus:</strong> {session.notes}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="text-xs text-muted-foreground">
                        Session ID: {session.id.toUpperCase()}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:space-x-3 gap-3 sm:gap-0">
                        <Button variant="outline" size="sm" onClick={noop}>
                          Reschedule
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={noop}>
                          <Video className="h-4 w-4 mr-1" />
                          Join Session
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-4">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No upcoming sessions</h3>
                  <p className="text-sm text-muted-foreground">
                    Book your first session to get started with professional support.
                  </p>
                  <Button onClick={() => setSelectedTab('book')}>Browse Counselors</Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {pastSessions.length > 0 ? (
              pastSessions.map((session) => (
                <Card key={session.id} className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">{session.counselorName}</h3>
                          <p className="text-sm text-muted-foreground">{session.sessionType}</p>
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
                        {Array.from({ length: session.rating }).map((_, index) => (
                          <Star key={`${session.id}-rating-${index}`} className="h-4 w-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>

                    {session.notes && (
                      <div className="p-3 bg-muted/40 rounded-lg dark:bg-slate-800/60 space-y-3">
                        <p className="text-sm text-foreground/80">
                          <strong>Session notes:</strong> {session.notes}
                        </p>
                        {session.outcomes && session.outcomes.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Key outcomes:</p>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {session.outcomes.map((outcome, index) => (
                                <li key={`${session.id}-outcome-${index}`} className="flex items-center space-x-1">
                                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  <span>{outcome}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="text-xs text-muted-foreground">Session completed • Confidential</div>
                      <Button variant="outline" size="sm" onClick={noop}>
                        Book Follow-up
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-sm bg-card dark:bg-slate-900 rounded-3xl">
                <div className="p-12 text-center space-y-4">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No session history</h3>
                  <p className="text-sm text-muted-foreground">Your completed sessions will appear here.</p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

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
                  <p className="text-xs text-muted-foreground">Learn about our confidentiality protections</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  );
}