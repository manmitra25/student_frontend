import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Calendar } from '../ui/calendar';
import { Badge } from '../ui/badge';
import { ArrowLeft, Clock, Star, Heart, Shield, Video, Calendar as CalendarIcon, User, Phone, CheckCircle, MessageCircle, MapPin, Award, GraduationCap } from 'lucide-react';
import Navigation from '../shared/Navigation';
import LoadingSpinner from '../shared/LoadingSpinner';
import { bookTherapist, confirmBooking } from '../../api/services/bookings';
import { getTherapists, Therapist } from '../../api/services/therapists';
import { useApp } from '../../App';
import BookSessionCard from '../shared/BookSessionCard';
import MessageModal from '../shared/MessageModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

export default function BookingPage() {
  const { user } = useApp() as any;
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCounselor, setSelectedCounselor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [sessionType, setSessionType] = useState<'video' | 'phone' | 'offline'>('video');
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [bookedAppointments, setBookedAppointments] = useState<any[]>([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedCounselorForMessage, setSelectedCounselorForMessage] = useState<string | null>(null);

  // Helper functions for booking restrictions
  const hasActiveBooking = () => bookedAppointments.length > 0;
  const getActiveBooking = () => bookedAppointments[0]; // Only one booking allowed

  const handleMessageCounselor = (counselorId: string) => {
    setSelectedCounselorForMessage(counselorId);
    setIsMessageModalOpen(true);
  };

  useEffect(() => {
    async function fetchTherapists() {
      try {
        setIsLoading(true);
        const fetchedTherapists = await getTherapists();
        setTherapists(fetchedTherapists);
      } catch (err) {
        setError('Failed to load therapists.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchTherapists();
  }, []);

  const handleBookSession = async (bookingData: {
    counselorId: string;
    date: Date;
    time: string;
    sessionType: 'video' | 'phone' | 'offline';
  }) => {
    setError('');
    try {
      setIsBooking(true);
      const studentId = user?.id;
      const therapistId = bookingData.counselorId;
      const time = `${bookingData.date.toISOString().split('T')[0]} ${bookingData.time}`;
      
      if (!studentId || !therapistId || !time) {
        setError('Please select a counselor, date, and time.');
        setIsBooking(false);
        return;
      }
      
      const { booking } = await bookTherapist({ studentId, therapistId, time });
      setBookingId(booking._id);
      
      // Add to booked appointments
      const newAppointment = {
        id: booking._id,
        counselorId: bookingData.counselorId,
        counselorName: therapists.find(t => t._id === bookingData.counselorId)?.name || 'Unknown',
        date: bookingData.date,
        time: bookingData.time,
        sessionType: bookingData.sessionType,
        status: 'confirmed'
      };
      
      setBookedAppointments(prev => [newAppointment, ...prev]);
      setIsBooked(true);
      setIsBookingDialogOpen(false);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const handleConfirm = async () => {
    if (!bookingId) return;
    try {
      await confirmBooking(bookingId);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Confirmation failed');
    }
  };

  if (isBooked) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-4 py-16">
          <Card className="mm-card mm-p-4 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-secondary" />
            </div>
            <h1 className="mm-text-h2 text-foreground mb-3">Booking Created 🎉</h1>
            <p className="mm-text-body text-muted-foreground mb-6">
              Your session with <strong>{therapists.find(c => c._id === selectedCounselor)?.name}</strong> is confirmed for{' '}
              <strong>{selectedDate?.toLocaleDateString()}</strong> at <strong>{selectedTime}</strong>.
            </p>
            {bookingId && (
              <div className="mm-text-small text-muted-foreground mb-4">Booking ID: {bookingId}</div>
            )}
            
            <div className="space-y-3">
              {bookingId && (
                <Button onClick={handleConfirm} className="w-full mm-btn-primary">
                  Confirm Now
                </Button>
              )}
              <Link to="/dashboard">
                <Button className="w-full mm-btn-primary">
                  <Heart className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setIsBooked(false);
                  setSelectedCounselor(null);
                  setSelectedTime(null);
                }}
              >
                Book Another Session
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mm-gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="mm-text-h2 text-foreground">Book a Session</h1>
              <p className="mm-text-small text-muted-foreground">
                Find a counselor who's right for you
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-24 scroll-smooth">
        {error && <div className="mm-error mb-4">{error}</div>}
        
        {/* Trust Message */}
        <Card className="mm-card mm-p-4 bg-gradient-to-br from-secondary/5 to-primary/5 mb-6">
          <div className="flex items-start mm-gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <h2 className="mm-text-h3 text-foreground mb-2">Safe & Private</h2>
              <p className="mm-text-small text-muted-foreground">
                All our counselors are licensed professionals. Your sessions are completely confidential.
              </p>
            </div>
          </div>
        </Card>

        {/* Step 1: Choose Counselor */}
        <div className="mb-8">
          <h2 className="mm-text-h3 text-foreground mb-4">Choose Your Counselor</h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner />
            </div>
          ) : therapists.length === 0 ? (
            <p className="text-muted-foreground text-center">No therapists available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {therapists.map((counselor) => (
                <Card 
                  key={counselor._id} 
                  className="mm-card mm-p-4 transition-all hover:shadow-lg hover:scale-[1.02] border-border"
                >
                  {/* Counselor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                        <User className="h-7 w-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="mm-text-h3 text-foreground font-semibold">{counselor.name}</h3>
                        <p className="mm-text-small text-muted-foreground">{counselor.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-foreground">{counselor.rating.toFixed(1)}</span>
                      </div>
                      <span className="mm-text-xs text-muted-foreground">({counselor.reviews} reviews)</span>
                      {counselor.isOnline && (
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
                          <span className="mm-text-xs text-secondary">Online now</span>
                        </div>
                          )}
                        </div>
                      </div>
                      
                  {/* Counselor Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 mm-text-small text-muted-foreground">
                      <Award className="h-4 w-4 text-accent" />
                      <span><strong>Experience:</strong> {counselor.experience}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mm-text-small text-muted-foreground">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span><strong>Languages:</strong> {counselor.languages.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mm-text-small text-muted-foreground">
                      <MapPin className="h-4 w-4 text-secondary" />
                      <span><strong>Location:</strong> Campus Counseling Center</span>
                    </div>

                    {/* Available Time Slots */}
                    <div className="mt-3">
                      <p className="mm-text-small font-medium text-foreground mb-2">Available Today:</p>
                      <div className="flex flex-wrap gap-2">
                        {['9:00 AM', '2:00 PM', '4:00 PM'].map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {time}
                          </Badge>
                        ))}
                      </div>
                        </div>
                      </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {hasActiveBooking() ? (
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Already have a booking</p>
                        <p className="text-xs font-medium text-foreground">
                          {getActiveBooking().counselorName} - {getActiveBooking().date.toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <Button 
                        className="w-full mm-btn-primary"
                        onClick={() => {
                          setSelectedCounselor(counselor._id);
                          setIsBookingDialogOpen(true);
                        }}
                      >
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Book Session
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full border-secondary text-secondary hover:bg-secondary/5"
                      onClick={() => handleMessageCounselor(counselor._id)}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Book Session Dialog */}
        <BookSessionCard
          isOpen={isBookingDialogOpen}
          onClose={() => setIsBookingDialogOpen(false)}
          counselorName={therapists.find(c => c._id === selectedCounselor)?.name || 'Unknown'}
          counselorId={selectedCounselor || ''}
          onConfirm={handleBookSession}
        />

        {/* Message Modal */}
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => {
            setIsMessageModalOpen(false);
            setSelectedCounselorForMessage(null);
          }}
          counselorName={therapists.find(c => c._id === selectedCounselorForMessage)?.name || 'Unknown'}
          counselorId={selectedCounselorForMessage || ''}
        />

        {/* Your Booked Appointments */}
        {bookedAppointments.length > 0 && (
          <div className="mt-8 scroll-smooth">
            <h2 className="mm-text-h3 text-foreground mb-4">Your Current Booking</h2>
            <div className="space-y-4">
              {bookedAppointments.map((appointment) => (
                <Card key={appointment.id} className="mm-card mm-p-4 border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground text-lg">{appointment.counselorName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge 
                              className={`${
                                appointment.status === 'confirmed' 
                                  ? 'bg-secondary text-white' 
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {appointment.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Session #{appointment.id.slice(-4)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                          <CalendarIcon className="h-4 w-4 text-primary" />
                          <span className="text-foreground font-medium">
                            {appointment.date.toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span className="text-foreground font-medium">{appointment.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                          {appointment.sessionType === 'video' && <Video className="h-4 w-4 text-primary" />}
                          {appointment.sessionType === 'phone' && <Phone className="h-4 w-4 text-secondary" />}
                          {appointment.sessionType === 'offline' && <User className="h-4 w-4 text-accent" />}
                          <span className="text-foreground font-medium capitalize">{appointment.sessionType}</span>
                        </div>
                      </div>

                      {/* Action buttons for booked appointment */}
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMessageCounselor(appointment.counselorId)}
                          className="flex-1"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Counselor
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex-1"
                          onClick={() => alert('Reschedule functionality coming soon!')}
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <Card className="mt-8 mm-card mm-p-4 bg-gradient-to-br from-accent/5 to-destructive/5 text-center">
          <Heart className="h-6 w-6 text-accent mx-auto mb-3" />
          <h3 className="mm-text-h3 text-foreground mb-2">Need Help Right Now?</h3>
          <p className="mm-text-body text-muted-foreground mb-4">
            If you can't wait for your appointment, we have immediate support available.
          </p>
          <div className="flex flex-col sm:flex-row mm-gap-3 justify-center">
            <Link to="/crisis">
              <Button className="crisis-support">
                <Shield className="h-4 w-4 mr-2" />
                Crisis Support
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" className="border-primary text-primary">
                <Heart className="h-4 w-4 mr-2" />
                Chat with AI
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  );
}