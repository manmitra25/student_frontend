import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Calendar } from '../ui/calendar';
import { Badge } from '../ui/badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Phone, 
  MessageCircle,
  CheckCircle,
  X,
  User,
  MapPin
} from 'lucide-react';

interface BookSessionCardProps {
  isOpen: boolean;
  onClose: () => void;
  counselorName: string;
  counselorId: string;
  onConfirm: (bookingData: {
    counselorId: string;
    date: Date;
    time: string;
    sessionType: 'video' | 'phone' | 'offline';
  }) => void;
}

const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];

const sessionTypes = [
  {
    id: 'video' as const,
    label: 'Video Call',
    description: 'Face-to-face via secure video',
    icon: Video,
    color: 'text-primary'
  },
  {
    id: 'phone' as const,
    label: 'Phone Call',
    description: 'Voice-only for privacy',
    icon: Phone,
    color: 'text-secondary'
  },
  {
    id: 'offline' as const,
    label: 'In-Person',
    description: 'Meet at counseling center',
    icon: User,
    color: 'text-accent'
  }
];

export default function BookSessionCard({ 
  isOpen, 
  onClose, 
  counselorName, 
  counselorId,
  onConfirm 
}: BookSessionCardProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSessionType, setSelectedSessionType] = useState<'video' | 'phone' | 'offline'>('video');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm({
        counselorId,
        date: selectedDate,
        time: selectedTime,
        sessionType: selectedSessionType
      });
      onClose();
    }
  };

  const handleNext = () => {
    if (selectedDate && selectedTime && selectedSessionType) {
      setShowConfirmation(true);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-md sm:max-w-lg max-h-[95vh] overflow-hidden bg-card">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Book a Session</h2>
              <p className="text-sm text-muted-foreground">Complete your booking with {counselorName}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {!showConfirmation ? (
              <>
                {/* Step 1: Date Selection */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Select Date
                  </h3>
                  <Card className="p-3 border-border">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className="rounded-md"
                    />
                  </Card>
                </div>

                {/* Step 2: Time Selection */}
                {selectedDate && (
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-secondary" />
                      Select Time
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          size="sm"
                          className={`${
                            selectedTime === time 
                              ? "bg-primary text-white" 
                              : "border-border hover:bg-muted/50"
                          }`}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Session Type */}
                {selectedDate && selectedTime && (
                  <div className="mb-6">
                    <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-accent" />
                      Session Type
                    </h3>
                    <div className="space-y-3">
                      {sessionTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <Card
                            key={type.id}
                            className={`p-3 cursor-pointer transition-all border-2 ${
                              selectedSessionType === type.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedSessionType(type.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedSessionType === type.id
                                  ? 'bg-primary/20'
                                  : 'bg-muted/50'
                              }`}>
                                <IconComponent className={`h-5 w-5 ${
                                  selectedSessionType === type.id ? 'text-primary' : type.color
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-foreground text-sm">{type.label}</h4>
                                <p className="text-xs text-muted-foreground">{type.description}</p>
                              </div>
                              {selectedSessionType === type.id && (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Confirmation Step */
              <>
                <div className="mb-6">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    Confirm Your Booking
                  </h3>
                  
                  <Card className="p-4 border-border">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Counselor:</span>
                        <span className="font-medium text-foreground text-sm">{counselorName}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Date:</span>
                        <span className="font-medium text-foreground text-sm">
                          {selectedDate?.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Time:</span>
                        <span className="font-medium text-foreground text-sm">{selectedTime}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-sm">Session Type:</span>
                        <Badge variant="outline" className="capitalize text-xs">
                          {selectedSessionType}
                        </Badge>
                      </div>

                      {selectedSessionType === 'offline' && (
                        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span className="text-xs text-foreground">
                            Meeting location: Campus Counseling Center
                          </span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </>
            )}
          </div>

          {/* Fixed Footer with Action Buttons */}
          <div className="flex gap-3 p-4 sm:p-6 pt-4 border-t flex-shrink-0">
            {!showConfirmation ? (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  Continue
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Booking
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
