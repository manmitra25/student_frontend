import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

import { Card } from '../ui/card';

import { Badge } from '../ui/badge';

import { Input } from '../ui/input';

import { ArrowLeft, Heart, Shield, Hash, MessageCircle, Send, Eye, EyeOff, Volume2, VolumeX, Smile } from 'lucide-react';

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



const communityHighlights: Record<string, { theme: string; description: string; tagline: string; tags: string[] }> = {

 '1': {

  theme: 'Cultivating calm, together',

  description: 'Gentle check-ins, grounding rituals, and a place to share how you truly feel—no pressure, only understanding.',

  tagline: 'Take a mindful pause and let the community hold space for you.',

  tags: ['mindful-moments', 'self-compassion', 'breathing-room'],

 },

 '2': {

  theme: 'Balancing academics with wellbeing',

  description: 'Swap focus hacks, share study playlists, and keep motivation compassionate—not punishing.',

  tagline: 'You are more than your deadlines; let’s pace the journey together.',

  tags: ['gentle-productivity', 'study-buddies', 'progress-not-perfection'],

 },

 '3': {

  theme: 'Celebrating creativity without burnout',

  description: 'Reconnect with your creative spark through nourishing prompts, supportive feedback, and cozy co-working.',

  tagline: 'Create with softness—rest is part of the process.',

  tags: ['creative-play', 'restorative-breaks', 'tiny-triumphs'],

 },

};



const supportTips = [

 '✨ Share how you would like to be supported today—others can meet you there.',

 '🌈 Validate before you advise; a kind word can shift someone’s entire day.',

 '🌿 Take what you need and leave what you can. Rest replies are welcome too.',

];



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

 const [showSupportTips, setShowSupportTips] = useState(true);

  



 const quickResponses = [

  '🫂 Sending you a virtual hug',

  '💙 You\'re not alone in this',

  '✨ That takes real courage',

  '🌱 Every small step matters',

  '💫 Be gentle with yourself',

 ];



 const selectedChannelData = dummyChannels.find((c) => c._id === selectedChannel);

 const selectedCommunity = communityHighlights[selectedCommunityId];

 const channelInsight = channelInsights[selectedChannel];

 const selectedCommunityMeta = dummyCommunities.find((c) => c._id === selectedCommunityId);



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

  <div className="min-h-screen bg-gray-50 transition-colors duration-300">

 {/* Header */}

 <header className="bg-white shadow sticky top-0 z-40">

  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

   <div className="flex items-center gap-4">

    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}><ArrowLeft className="h-4 w-4" /></Button>

    <div>

     <h1 className="text-2xl font-bold">{selectedCommunityMeta?.name} 💙</h1>

     <p className="text-sm text-gray-500">{selectedChannelData?.description}</p>

    </div>

   </div>

   <div className="flex items-center gap-2">

    <Button variant={isAnonymous ? "default" : "outline"} size="sm" onClick={() => setIsAnonymous(!isAnonymous)}>

     {isAnonymous ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}

     {isAnonymous ? 'Anonymous' : 'Visible'}

    </Button>

    <Button variant="ghost" size="sm" onClick={() => setNotifications(!notifications)}>

     {notifications ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}

    </Button>

   </div>

  </div>

 </header>



 <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

  {/* Sidebar */}

  <aside className="lg:col-span-1 space-y-6 sticky top-28">

   <Card className="p-4 space-y-4">

    <div>

     <label className="block text-sm text-gray-500 mb-2">Select Community</label>

     <select

      className="w-full p-2 border rounded"

      value={selectedCommunityId}

      onChange={(e) => setSelectedCommunityId(e.target.value)}

     >

      {dummyCommunities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}

     </select>

    </div>



    <div className="space-y-2">

     {dummyChannels.map(channel => (

      <button

       key={channel._id}

       onClick={() => handleChannelChange(channel._id)}

       className={`w-full p-3 rounded-xl text-left transition-colors ${

        selectedChannel === channel._id ? 'bg-blue-50 border border-blue-200 shadow' : 'hover:bg-gray-100'

       }`}

      >

       <p className="font-medium text-gray-800">#{channel.name}</p>

       <p className="text-xs text-gray-500">{channel.description}</p>

      </button>

     ))}

    </div>



    {/* Channel Insights */}

    <div className="p-3 bg-blue-50 rounded-xl text-sm space-y-1">

     <p className="font-medium text-blue-600">Channel Insight</p>

     <p>{channelInsight?.tip}</p>

     <div className="flex flex-wrap gap-1">

      {channelInsight?.tags.map(tag => (

       <Badge key={tag} className="bg-blue-100 text-blue-700">{tag}</Badge>

      ))}

     </div>

    </div>

   </Card>

  </aside>



  {/* Forum Threads */}

  <main className="lg:col-span-3 flex flex-col gap-4">

   {/* Messages */}

   {messages.map(msg => (

    <Card key={msg._id} className="p-4 space-y-2 hover:shadow-md transition-shadow">

     <div className="flex items-center justify-between">

      <span className="font-semibold">{msg.author}</span>

      <span className="text-xs text-gray-400">{formatTimestamp(msg.createdAt)}</span>

     </div>

     <p className="text-gray-700">{msg.content}</p>



     <div className="flex items-center gap-3 mt-2 text-sm">

      <Button

       variant="ghost"

       size="xs"

       className={`${likedMessages.includes(msg._id) ? 'text-red-500' : 'text-gray-500'}`}

       onClick={() => addHeart(msg._id)}

      >

       <Heart className="h-3 w-3 mr-1" /> {msg.hearts}

      </Button>

      <Button variant="ghost" size="xs" onClick={() => addReply(msg._id)}>

       <MessageCircle className="h-3 w-3 mr-1" /> Reply

      </Button>

     </div>



     {msg.replies.length > 0 && (

      <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-2">

       {msg.replies.map((r, i) => (

        <p key={i} className="text-gray-500 text-sm">↪ {r}</p>

       ))}

      </div>

     )}

    </Card>

   ))}



   {/* Input & Quick Response */}

<Card className="p-4 sticky bottom-0 bg-white shadow flex flex-col gap-2">

 <div className="flex items-center gap-2">

  <Input

   value={message}

   onChange={(e) => setMessage(e.target.value)}

   placeholder="Type a message…"

   className="flex-1 py-3 rounded-xl shadow-sm"

   onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } }}

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



 {/* Only one quick response visible at a time */}

 {showQuickResponses && quickResponses.length > 0 && (

  <div className="mt-2">

   <Button

    variant="outline"

    size="sm"

    className="w-full text-left"

    onClick={() => handleQuickResponse(quickResponses[0])} // only show the first one

   >

    {quickResponses[0]}

   </Button>

  </div>

 )}

</Card>



  </main>

 </div>

</div>

  );

}



