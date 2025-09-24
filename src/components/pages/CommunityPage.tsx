import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  ArrowLeft, 
  Users, 
  MessageCircle, 
  Heart, 
  Shield, 
  Plus, 
  Clock,
  Hash,
  Sparkles,
  Star,
  Send,
  Smile,
  UserCheck,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Coffee,
  Lightbulb,
  Headphones,
  Moon
} from 'lucide-react';
import Navigation from '../shared/Navigation';
import { listCommunities, joinCommunity, leaveCommunity } from '../../api/services/communities';
import { getChannels } from '../../api/services/channels';
import { getMessages, sendMessage as sendMessageApi } from '../../api/services/messages';
import { io, Socket } from 'socket.io-client';
import { useApp } from '../../App';

const supportChannels = [
  {
    id: 'gentle-check-ins',
    name: '💚 Gentle Check-ins',
    description: 'Safe space for daily mental health check-ins',
    memberCount: 342,
    activeNow: 18,
    color: 'secondary',
    emoji: '💚',
    isActive: true,
    mood: 'supportive'
  },
  {
    id: 'study-stress',
    name: '📚 Study Overwhelm',
    description: 'Academic pressure, exam anxiety, deadlines',
    memberCount: 267,
    activeNow: 24,
    color: 'primary',
    emoji: '📚',
    isActive: true,
    mood: 'understanding'
  },
  {
    id: 'family-expectations',
    name: '🏠 Family & Culture',
    description: 'Balancing family expectations with personal goals',
    memberCount: 198,
    activeNow: 12,
    color: 'accent',
    emoji: '🏠',
    isActive: true,
    mood: 'cultural'
  },
  {
    id: 'small-wins',
    name: '🌟 Small Victories',
    description: 'Celebrating progress, no matter how small',
    memberCount: 423,
    activeNow: 31,
    color: 'violet-500',
    emoji: '🌟',
    isActive: true,
    mood: 'positive'
  },
  {
    id: 'late-night-support',
    name: '🌙 Night Owls',
    description: 'For when anxiety strikes at 2 AM',
    memberCount: 156,
    activeNow: 8,
    color: 'indigo-500',
    emoji: '🌙',
    isActive: true,
    mood: 'gentle'
  },
  {
    id: 'creative-healing',
    name: '🎨 Creative Minds',
    description: 'Art, music, writing for emotional expression',
    memberCount: 134,
    activeNow: 6,
    color: 'pink-500',
    emoji: '🎨',
    isActive: true,
    mood: 'creative'
  }
];

const supportiveMessages = [
  {
    id: 1,
    channel: 'gentle-check-ins',
    author: 'Peaceful Butterfly 🦋',
    content: 'Just wanted to check in with everyone. How are you feeling today? Remember, even acknowledging difficult feelings is brave. 💙',
    hearts: 23,
    timeAgo: '3m ago',
    isSupported: true,
    reactions: ['💙', '🫂', '✨', '🙏'],
    reactionCounts: [12, 8, 6, 4],
    type: 'check-in'
  },
  {
    id: 2,
    channel: 'study-stress',
    author: 'Calm Panda 🐼',
    content: 'Took a 10-minute break from studying to breathe. Sometimes the best thing we can do is just... pause. Anyone else feeling the assignment pile-up stress? 📚💫',
    hearts: 18,
    timeAgo: '7m ago',
    isSupported: true,
    reactions: ['📚', '💫', '🫂'],
    reactionCounts: [9, 5, 7],
    type: 'support'
  },
  {
    id: 3,
    channel: 'small-wins',
    author: 'Brave Little Star ⭐',
    content: 'Update: I finally called that counselor today! It was scary but I did it. Appointment is next week. Baby steps count too 🌱',
    hearts: 47,
    timeAgo: '12m ago',
    isSupported: true,
    reactions: ['🌱', '💪', '🎉', '👏'],
    reactionCounts: [15, 12, 10, 8],
    type: 'victory'
  },
  {
    id: 4,
    channel: 'family-expectations',
    author: 'Understanding Soul 🌸',
    content: 'Parents asked again why I look tired. How do I explain mental health without them thinking it\'s "just stress"? Anyone have gentle ways to start this conversation? 💭',
    hearts: 31,
    timeAgo: '15m ago',
    isSupported: true,
    reactions: ['💭', '🫂', '💙'],
    reactionCounts: [14, 11, 6],
    type: 'question'
  }
];

const quickResponseTemplates = [
  '🫂 Sending you a virtual hug',
  '💙 You\'re not alone in this',
  '✨ That takes real courage',
  '🌱 Every small step matters',
  '💫 Be gentle with yourself',
  '🙏 Thank you for sharing'
];

export default function CommunityPage() {
  const { user } = useApp?.() || { user: null } as any;
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [channels, setChannels] = useState<any[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [error, setError] = useState<string>('');
  const socketRef = useRef<Socket | null>(null);
  const lastChannelRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  // Load communities on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await listCommunities({ page: 1, limit: 10 });
        setCommunities(data.communities || []);
        if (data.communities?.length) {
          setSelectedCommunityId((data.communities[0] as any)._id);
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load communities');
      }
    })();
  }, []);

  // Load channels when community changes
  useEffect(() => {
    if (!selectedCommunityId) return;
    (async () => {
      try {
        const data = await getChannels(selectedCommunityId);
        setChannels(data || []);
        if (data?.length) {
          setSelectedChannel(data[0]._id);
        } else {
          setSelectedChannel('');
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load channels');
      }
    })();
  }, [selectedCommunityId]);

  // Load messages when channel changes
  useEffect(() => {
    if (!selectedChannel) return;
    (async () => {
      try {
        const data = await getMessages(selectedChannel, { page: 1, limit: 50 });
        setMessages(data.messages || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || 'Failed to load messages');
      }
    })();
  }, [selectedChannel]);

  // Socket connection lifecycle
  useEffect(() => {
    const s = io('http://localhost:5000', {
      path: '/socket.io',
      transports: ['websocket'],
      query: { userId: user?.id || 'anonymous' },
    });
    socketRef.current = s;

    // Listeners
    s.on('new_message', (payload: any) => {
      if (payload?.channel === selectedChannel) {
        setMessages((prev) => [...prev, payload]);
      }
    });

    s.on('message_updated', (payload: any) => {
      setMessages((prev) => prev.map((m) => (m._id === payload._id ? payload : m)));
    });

    s.on('message_deleted', (payload: any) => {
      setMessages((prev) => prev.filter((m) => m._id !== payload._id));
    });

    s.on('user_typing', (payload: any) => {
      if (payload?.userId !== (user?.id || 'anonymous')) {
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    s.on('user_stop_typing', () => {
      setIsTyping(false);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // Join/leave socket room on channel change
  useEffect(() => {
    const s = socketRef.current;
    if (!s) return;
    const prev = lastChannelRef.current;
    if (prev) s.emit('leave_channel', prev);
    if (selectedChannel) s.emit('join_channel', selectedChannel);
    lastChannelRef.current = selectedChannel;
  }, [selectedChannel]);

  const selectedChannelData = channels.find((c) => c._id === selectedChannel);
  const channelMessages = messages;

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChannel) return;
    try {
      const sent = await sendMessageApi(selectedChannel, { content: message.trim() });
      setMessages((prev) => [...prev, sent]);
      setMessage('');
      setShowQuickResponses(false);
    } catch (e: any) {
      // If user is not a member, backend returns 403. Prompt to join.
      if (e?.response?.status === 403 && selectedCommunityId) {
        const username = window.prompt('Choose a community username to join:');
        if (username) {
          try {
            await joinCommunity(selectedCommunityId, username);
            // Retry sending after joining
            const sent = await sendMessageApi(selectedChannel, { content: message.trim() });
            setMessages((prev) => [...prev, sent]);
            setMessage('');
            setShowQuickResponses(false);
          } catch (je: any) {
            setError(je?.response?.data?.message || 'Failed to join community');
          }
        }
      } else {
        setError(e?.response?.data?.message || 'Failed to send message');
      }
    }
  };

  const addQuickResponse = (response: string) => {
    setMessage(message + (message ? ' ' : '') + response);
    setShowQuickResponses(false);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Gentle Header */}
      <header className="bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center mm-gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              
              <div className="flex items-center mm-gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl flex items-center justify-center">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h1 className="mm-text-h1 text-foreground flex items-center mm-gap-2">
                    Support Circle 💙
                  </h1>
                  <p className="mm-text-small text-muted-foreground">
                    Safe space • Be kind and supportive
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center mm-gap-2">
              <Button 
                variant={isAnonymous ? "default" : "outline"}
                size="sm" 
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={isAnonymous ? "mm-btn-primary mm-btn-sm" : "mm-btn-secondary mm-btn-sm"}
              >
                {isAnonymous ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {isAnonymous ? 'Anonymous' : 'Visible'}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setNotifications(!notifications)}
                className="hover:scale-110 transition-transform"
              >
                {notifications ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                <Shield className="h-3 w-3 mr-1" />
                Safe Space
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 mm-gap-6">
          {/* Gentle Channel Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mm-card mm-p-4 bg-gradient-to-br from-card to-muted/20 sticky top-28">
              <div className="flex items-center mm-gap-2 mb-6">
                <Heart className="h-5 w-5 text-secondary" />
                <h2 className="mm-text-h2 text-foreground">Support Spaces</h2>
              </div>
              {/* Community selector */}
              <div className="mb-4">
                <label className="mm-text-small text-muted-foreground block mb-2">Select Community</label>
                <select
                  className="mm-input"
                  value={selectedCommunityId || ''}
                  onChange={(e) => setSelectedCommunityId(e.target.value)}
                >
                  {communities.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
                            <div className="space-y-3">
                  {channels.length === 0 && (
                    <p className="mm-text-small text-muted-foreground">No channels yet.</p>
                  )}
                  {channels.map((channel) => (
                    <button
                      key={channel._id}
                      onClick={() => setSelectedChannel(channel._id)}
                      className={`w-full p-3 rounded-xl text-left transition-all hover:scale-[1.02] ${
                        selectedChannel === channel._id ? 'bg-muted/40 border border-border shadow-lg' : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`mm-text-small font-medium ${
                          selectedChannel === channel._id ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          #{channel.name}
                        </span>
                      </div>
                      {channel.description && (
                        <p className="mm-text-xs text-muted-foreground leading-relaxed">{channel.description}</p>
                      )}
                    </button>
                  ))}
                </div>

              {/* Community Guidelines Preview */}
              <div className="mt-6 mm-p-3 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-xl border border-border/30">
                <div className="flex items-center mm-gap-2 mb-2">
                  <Shield className="h-4 w-4 text-secondary" />
                  <span className="mm-text-small font-medium text-foreground">Our Promise</span>
                </div>
                <div className="space-y-1 mm-text-xs text-muted-foreground">
                  <p>🤗 Be kind and supportive</p>
                  <p>🛡️ Respect anonymity</p>
                  <p>💙 Listen without judgment</p>
                  <p>🌱 Celebrate small wins</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Support Chat */}
          <div className="lg:col-span-3">
            {selectedChannelData && (
              <Card className="mm-card overflow-hidden">
                {/* Channel Header */}
                <div className="mm-p-4 border-b border-border bg-gradient-to-r from-card to-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center mm-gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/10 rounded-xl flex items-center justify-center`}>
                        <Hash className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="mm-text-h3 text-foreground">{selectedChannelData?.name || 'Channel'}</h3>
                        {selectedChannelData?.description && (
                          <p className="mm-text-small text-muted-foreground">{selectedChannelData.description}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center mm-gap-4 mm-text-small text-muted-foreground" />
                  </div>
                </div>

                {/* Messages Area */}
                <div className="h-[500px] overflow-y-auto mm-p-4 space-y-6">
                  {channelMessages.map((msg: any, idx: number) => (
                    <div key={msg._id || idx} className="group hover:bg-muted/20 mm-p-3 rounded-xl transition-colors">
                      <div className="flex mm-gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <Heart className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center mm-gap-2 mb-2">
                          <span className="mm-text-small font-medium text-foreground">{(msg.author && (msg.author.username || msg.author.email)) || msg.communityUsername || 'Member'}</span>
                          <Badge className={`mm-text-xs ${'bg-primary/10 text-primary'}`}>Message</Badge>
                          {msg.createdAt && (
                            <span className="mm-text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleString()}</span>
                          )}
                        </div>
                        
                        <p className="mm-text-body text-foreground leading-relaxed mb-3">{msg.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center mm-gap-2" />
                          
                          <div className="flex items-center mm-gap-2">
                            <Button variant="ghost" size="sm" className="mm-text-xs hover:scale-105 transition-transform">
                              <Heart className="h-3 w-3 mr-1" />
                              Send Love
                            </Button>
                            <Button variant="ghost" size="sm" className="mm-text-xs hover:scale-105 transition-transform">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex mm-gap-3 mm-p-3 opacity-70">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full flex items-center justify-center">
                      <Heart className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mm-gap-2 mb-1">
                        <span className="mm-text-small font-medium text-foreground">Someone is sharing...</span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input - unified container */}
              <div className="mm-p-4 border-t border-border bg-gradient-to-r from-card to-muted/20 relative">
                <Input
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    const s = socketRef.current;
                    if (!s || !selectedChannel) return;
                    s.emit('typing_start', { channelId: selectedChannel, username: user?.name || 'Anonymous' });
                    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                      s.emit('typing_stop', { channelId: selectedChannel });
                    }, 1000);
                  }}
                  placeholder={`Share your thoughts with ${selectedChannelData?.name?.toLowerCase?.().replace(/[^\w\s]/gi, '') || 'channel'}... 💭`}
                  className="mm-input pr-20 py-3 rounded-xl shadow-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center mm-gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 hover:scale-110 transition-transform"
                    onClick={() => setShowQuickResponses(!showQuickResponses)}
                  >
                    <Heart className="h-4 w-4 text-secondary" />
                  </Button>
                  <Button variant="ghost" size="sm" className="p-1 hover:scale-110 transition-transform">
                    <Smile className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="mm-text-xs text-muted-foreground flex items-center mm-gap-2">
                    <Shield className="h-3 w-3" />
                    {isAnonymous ? 'Anonymous' : 'Visible'} • Encrypted • Be gentle ✨
                  </p>
                  <p className="mm-text-xs text-muted-foreground">Shift+Enter for new line</p>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    size="lg"
                    className="mm-btn-primary px-6 py-3 rounded-xl shadow-sm hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
            )}
          </div>
          </div>
        </div>

      {/* Error banner */}
      {error && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
          <div className="mm-error">{error}</div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Navigation />
      </div>
    </div>
  );
}