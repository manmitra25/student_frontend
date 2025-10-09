import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '../ui/button';

import { Card } from '../ui/card';

import { Badge } from '../ui/badge';

import { Input } from '../ui/input';

import { ArrowLeft, Heart, MessageCircle, Send, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';

import { ThemeToggle } from '../ui/theme-toggle';
import Navigation from '../shared/Navigation';
import LanguageToggle from '../shared/LanguageToggle';
import { useLanguage, Language } from '../shared/LanguageProvider';

const translations = {
  en: {
    toggleChannels: {
      show: 'Show Channels',
      hide: 'Hide Channels',
    },
    anonymous: 'Anonymous',
    visible: 'Visible',
    notificationsOn: 'Notifications on',
    notificationsOff: 'Notifications off',
    sidebarTitle: 'Communities & Channels',
    close: 'Close',
    selectCommunity: 'Select Community',
    channelInsight: 'Channel Insight',
    reply: 'Reply',
    inputPlaceholder: 'Type a message…',
    moreReplies: 'Replies',
  },
  hi: {
    toggleChannels: {
      show: 'चैनल दिखाएँ',
      hide: 'चैनल छिपाएँ',
    },
    anonymous: 'अनाम',
    visible: 'सार्वजनिक',
    notificationsOn: 'सूचनाएँ चालू',
    notificationsOff: 'सूचनाएँ बंद',
    sidebarTitle: 'समुदाय और चैनल',
    close: 'बंद करें',
    selectCommunity: 'समुदाय चुनें',
    channelInsight: 'चैनल अंतर्दृष्टि',
    reply: 'जवाब दें',
    inputPlaceholder: 'संदेश लिखें…',
    moreReplies: 'जवाब',
  },
} as const;

const communities = [
  { _id: '1', name: { en: 'Mental Wellness', hi: 'मानसिक स्वास्थ्य' } },
  { _id: '2', name: { en: 'Study Stress', hi: 'पढ़ाई का तनाव' } },
  { _id: '3', name: { en: 'Creative Minds', hi: 'रचनात्मक मन' } },
] as const;

const channels = [
  {
    _id: 'a',
    name: { en: 'Gentle Check-ins', hi: 'मृदु हालचाल' },
    description: {
      en: 'Daily mental health check-ins',
      hi: 'दैनिक मानसिक स्वास्थ्य हालचाल',
    },
  },
  {
    _id: 'b',
    name: { en: 'Study Overwhelm', hi: 'पढ़ाई का बोझ' },
    description: {
      en: 'Academic pressure and deadlines',
      hi: 'शैक्षणिक दबाव और समयसीमा',
    },
  },
  {
    _id: 'c',
    name: { en: 'Small Victories', hi: 'छोटी जीतें' },
    description: {
      en: 'Celebrate small wins',
      hi: 'छोटी जीतें मनाएँ',
    },
  },
] as const;

const channelInsights: Record<string, {
  mood: Record<Language, string>;
  activeMembers: number;
  tags: Array<{ key: string; label: Record<Language, string> }>;
  tip: Record<Language, string>;
}> = {
  a: {
    mood: { en: 'Gentle & Grounded', hi: 'कोमल और संतुलित' },
    activeMembers: 36,
    tags: [
      { key: 'daily-check-in', label: { en: 'Daily check-in', hi: 'दैनिक हालचाल' } },
      { key: 'emotional-weather', label: { en: 'Emotional weather', hi: 'भावनात्मक हाल' } },
      { key: 'kind-reflections', label: { en: 'Kind reflections', hi: 'दयालु विचार' } },
    ],
    tip: {
      en: 'Prompt: name one feeling that is visiting you and how you’re tending to it.',
      hi: 'प्रेरणा: एक भावना का नाम बताइए जो आज आपके साथ है और आप उसका कैसे ध्यान रख रहे हैं।',
    },
  },
  b: {
    mood: { en: 'Focused yet Flexible', hi: 'एकाग्र पर लचीला' },
    activeMembers: 28,
    tags: [
      { key: 'study-buddy', label: { en: 'Study buddy', hi: 'पढ़ाई साथी' } },
      { key: 'balanced-breaks', label: { en: 'Balanced breaks', hi: 'संतुलित विराम' } },
      { key: 'micro-goals', label: { en: 'Micro goals', hi: 'छोटे लक्ष्य' } },
    ],
    tip: {
      en: 'Prompt: share the next compassionate step on your study list today.',
      hi: 'प्रेरणा: आज अपनी पढ़ाई सूची का अगला दयालु कदम साझा करें।',
    },
  },
  c: {
    mood: { en: 'Celebratory & Bright', hi: 'उत्सवी और उज्ज्वल' },
    activeMembers: 42,
    tags: [
      { key: 'small-wins', label: { en: 'Small wins', hi: 'छोटी जीत' } },
      { key: 'gratitude-loop', label: { en: 'Gratitude loop', hi: 'कृतज्ञता चक्र' } },
      { key: 'daily-delights', label: { en: 'Daily delights', hi: 'दैनिक आनंद' } },
    ],
    tip: {
      en: 'Prompt: shout out a tiny victory and how it made you feel inside.',
      hi: 'प्रेरणा: एक छोटी जीत साझा करें और उसने आपको भीतर से कैसा महसूस कराया।',
    },
  },
};

const quickResponses = [
  {
    id: 'hug',
    text: {
      en: '🫂 Sending you a virtual hug',
      hi: '🫂 आपको एक वर्चुअल आलिंगन',
    },
  },
  {
    id: 'not-alone',
    text: {
      en: '💙 You’re not alone in this',
      hi: '💙 आप अकेले नहीं हैं',
    },
  },
  {
    id: 'courage',
    text: {
      en: '✨ That takes real courage',
      hi: '✨ यह सचमुच साहस मांगता है',
    },
  },
  {
    id: 'small-steps',
    text: {
      en: '🌱 Every small step matters',
      hi: '🌱 हर छोटा कदम मायने रखता है',
    },
  },
  {
    id: 'be-gentle',
    text: {
      en: '💫 Be gentle with yourself',
      hi: '💫 अपने प्रति सहज रहें',
    },
  },
];

type LocalizedMessage = {
  _id: string;
  author: string;
  content: Record<Language, string>;
  hearts: number;
  replies: Array<Record<Language, string>>;
  createdAt: string;
};

const dummyMessages: Record<string, LocalizedMessage[]> = {
 a: [
  { _id: 'a1', author: 'Peaceful Butterfly 🦋', content: { en: 'How are you feeling today?', hi: 'आज आप कैसा महसूस कर रहे हैं?' }, hearts: 2, replies: [], createdAt: new Date().toISOString() },
  { _id: 'a2', author: 'Calm Panda 🐼', content: { en: 'Remember to breathe and take care of yourself.', hi: 'गहरी सांस लें और अपना ध्यान रखें।' }, hearts: 1, replies: [], createdAt: new Date().toISOString() },
  { _id: 'a3', author: 'Gentle Soul 🌸', content: { en: 'It’s okay to take a break when you need it.', hi: 'जब ज़रूरत हो तो विश्राम करना बिल्कुल ठीक है।' }, hearts: 0, replies: [], createdAt: new Date().toISOString() },
  { _id: 'a4', author: 'Kind Heart 💛', content: { en: 'Sending love to everyone here! 💙', hi: 'सबके लिए प्यार भेज रहा हूँ! 💙' }, hearts: 3, replies: [], createdAt: new Date().toISOString() },
  { _id: 'a5', author: 'Mindful Owl 🦉', content: { en: 'Feelings are valid. Take one step at a time.', hi: 'आपकी भावनाएँ महत्वपूर्ण हैं। एक बार में एक कदम उठाएँ।' }, hearts: 1, replies: [], createdAt: new Date().toISOString() },
 ],
 b: [
  { _id: 'b1', author: 'Study Buddy 📚', content: { en: 'Anyone else feeling stressed about exams?', hi: 'क्या कोई और परीक्षाओं को लेकर तनाव महसूस कर रहा है?' }, hearts: 0, replies: [], createdAt: new Date().toISOString() },
  { _id: 'b2', author: 'Focus Fox 🦊', content: { en: 'Break tasks into smaller steps!', hi: 'कार्य को छोटे चरणों में बाँटें!' }, hearts: 2, replies: [], createdAt: new Date().toISOString() },
  { _id: 'b3', author: 'Calm Kitten 🐱', content: { en: 'Pomodoro technique really helps with focus.', hi: 'पोमोडोरो तकनीक ध्यान केंद्रित करने में मदद करती है।' }, hearts: 1, replies: [], createdAt: new Date().toISOString() },
  { _id: 'b4', author: 'Lazy Cat 🐈', content: { en: 'Even a 10-minute study counts.', hi: '10 मिनट की पढ़ाई भी मायने रखती है।' }, hearts: 0, replies: [], createdAt: new Date().toISOString() },
  { _id: 'b5', author: 'Motivated Mouse 🐭', content: { en: 'Take breaks, stretch, and drink water! 💧', hi: 'विराम लें, खिंचाव करें और पानी पिएँ! 💧' }, hearts: 3, replies: [], createdAt: new Date().toISOString() },
 ],
 c: [
  { _id: 'c1', author: 'Brave Little Star ⭐', content: { en: 'I finished my assignment today! 🌟', hi: 'आज मैंने अपना असाइनमेंट पूरा किया! 🌟' }, hearts: 4, replies: [], createdAt: new Date().toISOString() },
  { _id: 'c2', author: 'Happy Turtle 🐢', content: { en: 'Celebrated my win with a walk outside!', hi: 'मैंने अपनी जीत का जश्न बाहर टहल कर मनाया!' }, hearts: 1, replies: [], createdAt: new Date().toISOString() },
  { _id: 'c3', author: 'Joyful Dolphin 🐬', content: { en: 'Tried cooking something new today. 🥗', hi: 'आज कुछ नया पकाने की कोशिश की। 🥗' }, hearts: 2, replies: [], createdAt: new Date().toISOString() },
  { _id: 'c4', author: 'Cheerful Bunny 🐇', content: { en: 'Completed my morning workout! 💪', hi: 'मैंने अपनी सुबह की कसरत पूरी की! 💪' }, hearts: 3, replies: [], createdAt: new Date().toISOString() },
  { _id: 'c5', author: 'Smiling Sun 🌞', content: { en: 'Had a productive day at work, feeling good!', hi: 'काम का दिन उत्पादक रहा, अच्छा महसूस हो रहा है!' }, hearts: 2, replies: [], createdAt: new Date().toISOString() },
 ],
};

export default function CommunityPage() {
 const navigate = useNavigate();
 const { language } = useLanguage();
 const t = translations[language];

  const [selectedCommunityId, setSelectedCommunityId] = useState(communities[0]._id);

  const [selectedChannel, setSelectedChannel] = useState(channels[0]._id);

  const [messages, setMessages] = useState(dummyMessages[channels[0]._id]);

  const [message, setMessage] = useState('');

  const [isAnonymous, setIsAnonymous] = useState(true);

  const [notifications, setNotifications] = useState(true);

  const [showQuickResponses, setShowQuickResponses] = useState(false);
  
 const [likedMessages, setLikedMessages] = useState<string[]>([]);

  const isClient = typeof window !== 'undefined';
  const defaultDesktop = isClient ? window.innerWidth >= 1024 : false;
  const [isDesktop, setIsDesktop] = useState(defaultDesktop);
  const [showSidebar, setShowSidebar] = useState(defaultDesktop);
  

  const quickResponsesLocalized = quickResponses.map((resp) => resp.text[language]);

  const selectedChannelData = channels.find((c) => c._id === selectedChannel);

 const channelInsight = channelInsights[selectedChannel];

 const selectedCommunityMeta = communities.find((c) => c._id === selectedCommunityId);



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

    const newMsg = { _id: Date.now().toString(), author: isAnonymous ? (language === 'en' ? 'Anonymous' : 'अनाम') : (language === 'en' ? 'You' : 'आप'), content: { en: message, hi: message }, hearts: 0, replies: [], createdAt: new Date().toISOString() };

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

    const updatedMessages = messages.map(msg => msg._id === msgId ? { ...msg, replies: [...msg.replies, { en: reply, hi: reply }] } : msg);

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
            <h1 className="text-2xl font-bold text-foreground">{selectedCommunityMeta?.name[language]} 💙</h1>
            <p className="text-sm text-muted-foreground">{selectedChannelData?.description[language]}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowSidebar((prev) => !prev)}
          >
            {showSidebar ? t.toggleChannels.hide : t.toggleChannels.show}
          </Button>
          <ThemeToggle />
          <Button
            variant={isAnonymous ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsAnonymous(!isAnonymous)}
          >
            {isAnonymous ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {isAnonymous ? t.anonymous : t.visible}
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
                <p className="text-sm font-medium text-muted-foreground">{t.sidebarTitle}</p>
                <Button variant="ghost" size="sm" onClick={() => setShowSidebar(false)}>
                  {t.close}
                </Button>
              </div>
          <div>
                <label className="block text-sm text-muted-foreground mb-2">{t.selectCommunity}</label>
            <select
                  className="w-full p-2 rounded border border-border bg-background text-foreground"
              value={selectedCommunityId}
              onChange={(e) => setSelectedCommunityId(e.target.value)}
            >
                  {communities.map((c) => (
                    <option key={c._id} value={c._id}>{c.name[language]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
                {channels.map((channel) => (
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
                    <p className="font-medium text-foreground">#{channel.name[language]}</p>
                    <p className="text-xs text-muted-foreground">{channel.description[language]}</p>
              </button>
            ))}
          </div>

          {/* Channel Insights */}
              <div className="p-3 bg-secondary/10 rounded-xl text-sm space-y-1 border border-secondary/30">
                <p className="font-medium text-foreground">{t.channelInsight}</p>
                <p className="text-muted-foreground">{channelInsight?.tip[language]}</p>
            <div className="flex flex-wrap gap-1">
              {channelInsight?.tags.map((tag) => (
                <Badge
                      key={tag.key}
                      className="rounded-full bg-secondary/10 text-foreground"
                >
                      {tag.label[language]}
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
            <p className="text-foreground/90">{msg.content[language]}</p>

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
                <MessageCircle className="h-3 w-3 mr-1" /> {t.reply}
              </Button>
            </div>

            {msg.replies.length > 0 && (
              <div className="ml-6 mt-2 space-y-1 border-l border-border pl-2">
                {msg.replies.map((r, i) => (
                  <p key={i} className="text-muted-foreground text-sm">↪ {r[language]}</p>
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
              placeholder={t.inputPlaceholder}
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

          {showQuickResponses && quickResponsesLocalized.length > 0 && (
            <div className="mt-2 space-y-2">
              {quickResponsesLocalized.map((quickResponse, index) => (
              <Button
                  key={index}
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
