import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  Send, 
  MessageCircle, 
  User, 
  Clock,
  Phone,
  Video,
  Mail
} from 'lucide-react';
import { useApp } from '../../App';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'counselor';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface Counselor {
  _id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  availability: string[];
  isOnline: boolean;
}

export default function DirectMessage() {
  const { counselorId } = useParams<{ counselorId: string }>();
  const { user } = useApp() as any;
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock counselor data - replace with actual API call
  useEffect(() => {
    const fetchCounselor = async () => {
      try {
        // Mock data - replace with actual API call
        const mockCounselor: Counselor = {
          _id: counselorId || '1',
          name: 'Dr. Sarah Johnson',
          specialization: 'Anxiety & Depression',
          experience: '8 years',
          rating: 4.8,
          availability: ['Mon 9:00 AM', 'Wed 2:00 PM', 'Fri 10:00 AM'],
          isOnline: true
        };
        setCounselor(mockCounselor);
        
        // Mock initial messages
        const initialMessages: Message[] = [
          {
            id: '1',
            content: 'Hello! I\'m here to help you. How are you feeling today?',
            sender: 'counselor',
            timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            type: 'text'
          },
          {
            id: '2',
            content: 'Hi Dr. Johnson, I\'ve been feeling quite anxious lately.',
            sender: 'user',
            timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
            type: 'text'
          },
          {
            id: '3',
            content: 'I understand. Anxiety can be overwhelming. Can you tell me more about what triggers these feelings?',
            sender: 'counselor',
            timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
            type: 'text'
          }
        ];
        setMessages(initialMessages);
      } catch (error) {
        console.error('Error fetching counselor:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounselor();
  }, [counselorId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate counselor response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Thank you for sharing that with me. I\'m here to listen and help you through this.',
        sender: 'counselor',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">{counselor?.name}</h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {counselor?.specialization}
                    </Badge>
                    {counselor?.isOnline && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600">Online</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Video
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4 mb-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <Card className="p-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                rows={3}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="bg-background border-t border-border p-4">
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/booking')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Book Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
