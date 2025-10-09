import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

import { Card } from '../ui/card';

import { Badge } from '../ui/badge';

import { Input } from '../ui/input';

import { ArrowLeft, Heart, MessageCircle, Send, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

import { ThemeToggle } from '../ui/theme-toggle';
import Navigation from '../shared/Navigation';


const dummyCommunities = [

  { _id: '1', name: 'Mental Wellness' },

  { _id: '2', name: 'Study Stress' },

  { _id: '3', name: 'Creative Minds' },

];



const dummyChannels = [

  { _id: 'a', name: 'Gentle Check-ins', description: 'Daily mental health check-ins' },

  { _id: 'b', name: 'Study Overwhelm', description: 'Academic pressure and deadlines' },

  { _id: 'c', name: 'Small Victories', description: 'Celebrate small wins' },

];



// Messages keyed by channel ID

const dummyMessages: Record<string, any[]> = {

 a: [

  { _id: 'a1', author: 'Peaceful Butterfly 🦋', content: 'How are you feeling today?', hearts: 2, replies: [], createdAt: new Date().toISOString() },

  { _id: 'a2', author: 'Calm Panda 🐼', content: 'Remember to breathe and take care of yourself.', hearts: 1, replies: [], createdAt: new Date().toISOString() },

  { _id: 'a3', author: 'Gentle Soul 🌸', content: 'It’s okay to take a break when you need it.', hearts: 0, replies: [], createdAt: new Date().toISOString() },

  { _id: 'a4', author: 'Kind Heart 💛', content: 'Sending love to everyone here! 💙', hearts: 3, replies: [], createdAt: new Date().toISOString() },

  { _id: 'a5', author: 'Mindful Owl 🦉', content: 'Remember, feelings are valid. Take one step at a time.', hearts: 1, replies: [], createdAt: new Date().toISOString() },

 ],

 b: [

    { _id: 'b1', author: 'Study Buddy 📚', content: 'Anyone else feeling stressed about exams?', hearts: 0, replies: [], createdAt: new Date().toISOString() },

  { _id: 'b2', author: 'Focus Fox 🦊', content: 'Break down your tasks into smaller steps!', hearts: 2, replies: [], createdAt: new Date().toISOString() },

  { _id: 'b3', author: 'Calm Kitten 🐱', content: 'Try the Pomodoro technique, it helps with focus.', hearts: 1, replies: [], createdAt: new Date().toISOString() },

  { _id: 'b4', author: 'Lazy Cat 🐈', content: 'Even a 10-minute study is progress.', hearts: 0, replies: [], createdAt: new Date().toISOString() },

  { _id: 'b5', author: 'Motivated Mouse 🐭', content: 'Take breaks, stretch, and drink water! 💧', hearts: 3, replies: [], createdAt: new Date().toISOString() },

 ],

 c: [

  { _id: 'c1', author: 'Brave Little Star ⭐', content: 'I finished my assignment today! 🌟', hearts: 4, replies: [], createdAt: new Date().toISOString() },

  { _id: 'c2', author: 'Happy Turtle 🐢', content: 'Celebrated my small win with a walk outside!', hearts: 1, replies: [], createdAt: new Date().toISOString() },

  { _id: 'c3', author: 'Joyful Dolphin 🐬', content: 'Finally tried cooking something new today. 🥗', hearts: 2, replies: [], createdAt: new Date().toISOString() },

  { _id: 'c4', author: 'Cheerful Bunny 🐇', content: 'Completed my morning workout routine! 💪', hearts: 3, replies: [], createdAt: new Date().toISOString() },

  { _id: 'c5', author: 'Smiling Sun 🌞', content: 'Had a productive day at work, feeling good!', hearts: 2, replies: [], createdAt: new Date().toISOString() },

 ],

};



const channelInsights: Record<string, { mood: string; activeMembers: number; tags: string[]; tip: string }> = {

 a: {

  mood: 'Gentle & Grounded',

  activeMembers: 36,

  tags: ['daily-check-in', 'emotional-weather', 'kind-reflections'],

  tip: 'Prompt: name one feeling that is visiting you and how you’re tending to it.',

 },

 b: {

  mood: 'Focused yet Flexible',

  activeMembers: 28,

  tags: ['study-buddy', 'balanced-breaks', 'micro-goals'],

  tip: 'Prompt: share the next compassionate step on your study list today.',

 },

 c: {

  mood: 'Celebratory & Bright',

  activeMembers: 42,

  tags: ['small-wins', 'gratitude-loop', 'daily-delights'],

  tip: 'Prompt: shout out a tiny victory and how it made you feel inside.',

 },

};





export default function CommunityPage() {
 const navigate = useNavigate();

  const [selectedCommunityId, setSelectedCommunityId] = useState(dummyCommunities[0]._id);

  const [selectedChannel, setSelectedChannel] = useState(dummyChannels[0]._id);

  const [messages, setMessages] = useState(dummyMessages[dummyChannels[0]._id]);

  const [message, setMessage] = useState('');

  const [isAnonymous, setIsAnonymous] = useState(true);

  const [notifications, setNotifications] = useState(true);

  const [showQuickResponses, setShowQuickResponses] = useState(false);
  
 const [likedMessages, setLikedMessages] = useState<string[]>([]);

  const isClient = typeof window !== 'undefined';
  const defaultDesktop = isClient ? window.innerWidth >= 1024 : false;
  const [isDesktop, setIsDesktop] = useState(defaultDesktop);
  const [showSidebar, setShowSidebar] = useState(defaultDesktop);
  

  const quickResponses = [

    '🫂 Sending you a virtual hug',

    '💙 You\'re not alone in this',

    '✨ That takes real courage',

    '🌱 Every small step matters',

    '💫 Be gentle with yourself',

  ];



  const selectedChannelData = dummyChannels.find((c) => c._id === selectedChannel);

 const channelInsight = channelInsights[selectedChannel];

 const selectedCommunityMeta = dummyCommunities.find((c) => c._id === selectedCommunityId);



useEffect(() => {
   if (!isClient) return;

    const updateLayout = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setShowSidebar((prev) => (desktop ? true : prev));
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    if (!isDesktop && showSidebar) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isClient, isDesktop, showSidebar]);


 const formatTimestamp = (dateString: string) => {

  try {

   return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  } catch (error) {

   return '';

  }

 };



  // Add message

  const handleSendMessage = () => {

    if (!message.trim()) return;

    const newMsg = { _id: Date.now().toString(), author: isAnonymous ? 'Anonymous' : 'You', content: message, hearts: 0, replies: [], createdAt: new Date().toISOString() };

    const updatedMessages = [...messages, newMsg];

    setMessages(updatedMessages);

    dummyMessages[selectedChannel] = updatedMessages; // persist for this channel

    setMessage('');

    setShowQuickResponses(false);

  };



  // When channel changes

  const handleChannelChange = (channelId: string) => {

    setSelectedChannel(channelId);

    setMessages(dummyMessages[channelId] || []);

  };



  // Add heart to message

  const addHeart = (msgId: string) => {

  if (likedMessages.includes(msgId)) return;

    const updatedMessages = messages.map(msg => msg._id === msgId ? { ...msg, hearts: msg.hearts + 1 } : msg);

    setMessages(updatedMessages);

    dummyMessages[selectedChannel] = updatedMessages;

  setLikedMessages((prev) => [...prev, msgId]);

  };



  // Add reply to message

  const addReply = (msgId: string) => {

    const reply = window.prompt('Type your reply:');

    if (!reply) return;

    const updatedMessages = messages.map(msg => msg._id === msgId ? { ...msg, replies: [...msg.replies, reply] } : msg);

    setMessages(updatedMessages);

    dummyMessages[selectedChannel] = updatedMessages;

  };



  // Quick response click

  const handleQuickResponse = (resp: string) => {

    setMessage(message + (message ? ' ' : '') + resp);

    setShowQuickResponses(false);

  };



  return (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--background),_var(--muted)_80%)] text-foreground transition-colors duration-300">
    {/* Header */}
    <header className="bg-card shadow sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold text-foreground">{selectedCommunityMeta?.name} 💙</h1>
            <p className="text-sm text-muted-foreground">{selectedChannelData?.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            {showSidebar ? 'Hide Channels' : 'Show Channels'}
          </Button>
          <ThemeToggle />
          <Button
            variant={isAnonymous ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsAnonymous(!isAnonymous)}
          >
            {isAnonymous ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {isAnonymous ? 'Anonymous' : 'Visible'}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => setNotifications(!notifications)}>
            {notifications ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>

    {/* Layout Grid */}
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      {showSidebar && (
        <>
          {!isDesktop && (
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}
          <aside
            className={
              isDesktop
                ? 'lg:col-span-1 space-y-6 lg:sticky lg:top-28'
                : 'fixed inset-x-4 top-24 bottom-6 z-40'
            }
          >
            <Card className="p-4 space-y-4 bg-card shadow-xl border transition-colors max-h-[calc(100vh-8rem)] overflow-y-auto">
              <div className="lg:hidden flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">Communities & Channels</p>
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                  Close
                </Button>
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Select Community</label>
                <select
                  className="w-full p-2 rounded border border-border bg-background text-foreground"
                  value={selectedCommunityId}
                  onChange={(e) => setSelectedCommunityId(e.target.value)}
                >
                  {dummyCommunities.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {dummyChannels.map((channel) => (
                  <button
                    key={channel._id}
                    onClick={() => {
                      handleChannelChange(channel._id);
                      if (!isDesktop) {
                        setShowSidebar(false);
                      }
                    }}
                    className={`w-full p-3 rounded-xl text-left transition-all border ${
                      selectedChannel === channel._id
                        ? 'border-primary bg-primary/10 shadow focus-visible:outline-ring'
                        : 'border-transparent hover:bg-muted'
                    }`}
                  >
                    <p className="font-medium text-foreground">#{channel.name}</p>
                    <p className="text-xs text-muted-foreground">{channel.description}</p>
                  </button>
                ))}
              </div>

              {/* Channel Insights */}
              <div className="p-3 bg-secondary/10 rounded-xl text-sm space-y-1 border border-secondary/30">
                <p className="font-medium text-foreground">Channel Insight</p>
                <p className="text-muted-foreground">{channelInsight?.tip}</p>
                <div className="flex flex-wrap gap-1">
                  {channelInsight?.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="rounded-full bg-secondary/10 text-foreground"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </aside>
        </>
      )}

      {/* Forum Threads */}
      <main className={`flex flex-col gap-4 ${isDesktop ? 'lg:col-span-3' : 'col-span-1'}`}>
        {/* Messages */}
        {messages.map((msg) => (
          <Card
            key={msg._id}
            className="p-4 space-y-2 bg-card hover:shadow-md transition-all border"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{msg.author}</span>
              <span className="text-xs text-muted-foreground">{formatTimestamp(msg.createdAt)}</span>
            </div>
            <p className="text-foreground/90">{msg.content}</p>

            <div className="flex items-center gap-3 mt-2 text-sm">
              <Button
                variant="ghost"
                size="xs"
                className={likedMessages.includes(msg._id) ? 'text-red-500' : 'text-muted-foreground'}
                onClick={() => addHeart(msg._id)}
              >
                <Heart className="h-3 w-3 mr-1" /> {msg.hearts}
              </Button>
              <Button variant="ghost" size="xs" onClick={() => addReply(msg._id)}>
                <MessageCircle className="h-3 w-3 mr-1" /> Reply
              </Button>
            </div>

            {msg.replies.length > 0 && (
              <div className="ml-6 mt-2 space-y-1 border-l border-border pl-2">
                {msg.replies.map((r, i) => (
                  <p key={i} className="text-muted-foreground text-sm">↪ {r}</p>
                ))}
              </div>
            )}
          </Card>
        ))}

        {/* Input & Quick Response */}
        <Card className="p-4 sticky bottom-0 bg-card border-t border-border shadow flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 py-3 rounded-xl shadow-sm bg-background text-foreground placeholder:text-muted-foreground"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />

            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 p-0 flex items-center justify-center"
              onClick={() => setShowQuickResponses(!showQuickResponses)}
            >
              <Heart className="h-4 w-4 text-secondary" />
            </Button>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
              className="h-10 w-10 p-0 flex items-center justify-center rounded-xl shadow-sm"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {showQuickResponses && quickResponses.length > 0 && (
            <div className="mt-2">
              {quickResponses.map((quickResponse) => (
                <Button
                  key={quickResponse}
                  variant="outline"
                  size="sm"
                  className="w-full text-left border-border bg-background text-foreground"
                  onClick={() => handleQuickResponse(quickResponse)}
                >
                  {quickResponse}
                </Button>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>

    <div className="sticky bottom-0 left-0 right-0 z-50">
      <Navigation />
    </div>
  </div>
);

}
