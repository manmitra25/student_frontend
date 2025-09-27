import React, { useState, useRef, useEffect } from 'react';

import { Link } from 'react-router-dom';

import { Button } from '../ui/button';

import { Card } from '../ui/card';

import { Input } from '../ui/input';

import { Badge } from '../ui/badge';

import { 

 ArrowLeft, 

 Send, 

 Heart, 

 Mic, 

 Smile, 

 MoreVertical,

 Shield,

 BookOpen,

 Users,

 AlertTriangle,

 CheckCircle,

 Clock,

 Sparkles,

 Coffee,

 Star,

 Zap,

 Moon

} from 'lucide-react';

import { useApp } from '../../App';

import { bestieChat } from '../../api/services/bestie';

import Navigation from '../shared/Navigation';

import ConsentModal from '../shared/ConsentModal';



interface Message {

 id: string;

 content: string;

 sender: 'user' | 'bestie';

 timestamp: Date;

 type: 'text' | 'assessment' | 'resource' | 'crisis';

 metadata?: {

  resourceTitle?: string;

  resourceLink?: string;

  assessmentQuestion?: string;

  assessmentOptions?: string[];

  crisisLevel?: 'low' | 'medium' | 'high';

 };

}



interface ChatPageProps {

 assessmentMode?: boolean;

}



export default function ChatPage({ assessmentMode = false }: ChatPageProps) {

 const [isConsentOpen, setIsConsentOpen] = useState(false);

 const [isInitialConsentRequired, setIsInitialConsentRequired] = useState(false);

 const handleConsent = (allowed: boolean) => {

  // Persisting is optional; primary requirement is to block until a choice is made

  try {

   localStorage.setItem('chat_summary_consent', allowed ? 'allowed' : 'denied');
   // Also sync with ProfilePage consent state
   localStorage.setItem('consent_summary_sharing', allowed.toString());

  } catch {}

  setIsConsentOpen(false);

  setIsInitialConsentRequired(false);

 };

 // Check if consent modal should be shown on first visit to Bestie in this session
 useEffect(() => {
   // Check if this is the first time visiting Bestie in this session
   const sessionKey = 'bestie_visited_this_session';
   const hasVisitedBestieThisSession = sessionStorage.getItem(sessionKey);
   
   if (!hasVisitedBestieThisSession) {
     // Mark that user has visited Bestie in this session
     sessionStorage.setItem(sessionKey, 'true');
     
     // Always show consent modal on first visit to Bestie in a new session
     // This ensures it shows after login even if consent was given before
     setIsConsentOpen(true);
     setIsInitialConsentRequired(true);
   }
 }, []);



 const { user } = useApp();

 const [messages, setMessages] = useState<Message[]>([

  {

   id: '1',

   content: assessmentMode 

    ? "Hey! 💙 I'm here for your wellness check-in. This is completely private and just helps me understand how to support you better. Ready when you are! ✨"

    : `Hey ${user?.name}! 🌟 I'm Bestie, your AI companion who's here 24/7. Think of me as that friend who's always ready to listen, support, and help you navigate whatever you're feeling. No judgment, just good vibes and real support. What's on your mind today? 💭`,

   sender: 'bestie',

   timestamp: new Date(),

   type: 'text'

  }

 ]);

  

 const [inputValue, setInputValue] = useState('');

 const [isTyping, setIsTyping] = useState(false);

 const [isCrisisDetected, setIsCrisisDetected] = useState(false);

 const messagesEndRef = useRef<HTMLDivElement>(null);



 const scrollToBottom = () => {

  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

 };



 useEffect(() => {

  scrollToBottom();

 }, [messages]);



 const detectCrisis = (message: string) => {

  const crisisKeywords = [

   'hurt myself', 'end it all', 'suicide', 'kill myself', 

   'no point', 'give up', 'hopeless', 'worthless'

  ];

  return crisisKeywords.some(keyword => 

   message.toLowerCase().includes(keyword.toLowerCase())

  );

 };



 const generateBestieResponse = (userMessage: string): Message => {

  const isCrisis = detectCrisis(userMessage);

   

  if (isCrisis) {

   setIsCrisisDetected(true);

   return {

    id: Date.now().toString(),

    content: "Hey, I'm really worried about what you just shared with me. 💙 Your safety matters more than anything else right now. I want to connect you with someone who can provide the support you need. Would you like me to help you reach out to a crisis counselor or emergency services? You don't have to go through this alone. 🫂",

    sender: 'bestie',

    timestamp: new Date(),

    type: 'crisis',

    metadata: { crisisLevel: 'high' }

   };

  }



  if (assessmentMode) {

   return {

    id: Date.now().toString(),

    content: "Let's start with how you're feeling mood-wise today. On a scale of 1-5, where would you place yourself? (1 = really struggling, 5 = feeling great) There's no wrong answer here! 💙",

    sender: 'bestie',

    timestamp: new Date(),

    type: 'assessment',

    metadata: {

     assessmentQuestion: "Mood rating",

     assessmentOptions: ['1 - Really struggling 😔', '2 - Having a tough time 😕', '3 - Okay, getting by 😐', '4 - Pretty good 🙂', '5 - Feeling great! 😊']

    }

   };

  }



  // More supportive and friend-like responses

  const responses = [

   "Thanks for sharing that with me! 💙 It takes real courage to open up about your feelings. I'm here to listen and support you. What would feel most helpful right now? 🤗",

   "I hear you, and I want you to know your feelings are totally valid. 💫 So many students go through similar experiences - you're definitely not alone in this. Want to explore some strategies together? ✨",

   "That sounds really challenging, and I appreciate you trusting me with this. 🫂 Sometimes just talking through our thoughts can help us see them more clearly. What's been weighing on your mind the most? 💭",

   "I'm really glad you're here talking with me about this. 🌟 Remember, reaching out for support shows incredible strength, not weakness. How can I best support you today? Let's figure this out together! 💪",

   "Hey, I get it - life can be overwhelming sometimes. 💙 You're taking the right step by talking about it. What's one small thing that might help you feel even a little bit better right now? ✨"

  ];



  return {

   id: Date.now().toString(),

   content: responses[Math.floor(Math.random() * responses.length)],

   sender: 'bestie',

   timestamp: new Date(),

   type: 'text'

  };

 };



 const handleSendMessage = async () => {

  if (!inputValue.trim()) return;



  const outgoingText = inputValue;

  const userMessage: Message = {

   id: Date.now().toString(),

   content: outgoingText,

   sender: 'user',

   timestamp: new Date(),

   type: 'text'

  };



  setMessages(prev => [...prev, userMessage]);

  setInputValue('');

  setIsTyping(true);



  try {

   // For assessment mode, keep local guided flow

   if (assessmentMode) {

    const bestieResponse = generateBestieResponse(outgoingText);

    setMessages(prev => [...prev, bestieResponse]);

    return;

   }



   // Call FastAPI Bestie for normal chat

   const reply = await bestieChat(outgoingText, user?.id);

   const crisisDetected = detectCrisis(reply);

   if (crisisDetected) setIsCrisisDetected(true);

   const bestieResponse: Message = {

    id: Date.now().toString(),

    content: reply,

    sender: 'bestie',

    timestamp: new Date(),

    type: crisisDetected ? 'crisis' : 'text'

   };

   setMessages(prev => [...prev, bestieResponse]);

  } catch (error) {

   console.error('Bestie API error:', error);

   const fallbackResponse: Message = {

    id: Date.now().toString(),

    content: "I'm having a little trouble reaching my brain right now, but I'm still here for you! 💙 Can you try that again in a moment?",

    sender: 'bestie',

    timestamp: new Date(),

    type: 'text'

   };

   setMessages(prev => [...prev, fallbackResponse]);

  } finally {

   setIsTyping(false);

  }

 };



 const handleKeyPress = (e: React.KeyboardEvent) => {

  if (e.key === 'Enter' && !e.shiftKey) {

   e.preventDefault();

   handleSendMessage();

  }

 };



 const renderMessage = (message: Message) => {

  const isUser = message.sender === 'user';

   

  return (

   <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>

    <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>

     {!isUser && (

      <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">

       <div className="w-8 h-8 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">

        <Heart className="h-4 w-4 text-secondary" />

       </div>

       <span className="font-medium">Bestie</span>

       <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>

      </div>

     )}

      

     <div className={`p-4 rounded-2xl transition-all hover:scale-[1.02] ${

      isUser 

       ? 'bg-gradient-to-r from-primary to-primary/90 text-white ml-8 shadow-lg shadow-primary/20' 

       : message.type === 'crisis'

        ? 'bg-gradient-to-r from-destructive/10 to-destructive/5 border-2 border-destructive/20 mr-8 shadow-lg'

        : 'bg-gradient-to-r from-card to-muted/50 mr-8 shadow-lg border'

     }`}>

      <p className={`${isUser ? 'text-white' : 'text-foreground'} leading-relaxed`}>

       {message.content}

      </p>

       

      {/* Crisis Support Actions - Enhanced */}

      {message.type === 'crisis' && (

       <div className="mt-6 space-y-3">

        <Link to="/crisis">

         <Button className="w-full crisis-support text-sm hover:scale-105 transition-transform">

          <Shield className="h-4 w-4 mr-2" />

          Get Immediate Help 🆘

         </Button>

        </Link>

        <Link to="/booking?urgent=true">

         <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/5 hover:scale-105 transition-all text-sm">

          <Heart className="h-4 w-4 mr-2" />

          Talk to a Counselor Now 💙

         </Button>

        </Link>

       </div>

      )}

       

      {/* Assessment Options - Enhanced */}

      {message.type === 'assessment' && message.metadata?.assessmentOptions && (

       <div className="mt-6 space-y-3">

        {message.metadata.assessmentOptions.map((option, index) => (

         <Button

          key={index}

          variant="outline"

          className="w-full border-primary text-primary hover:bg-primary/5 hover:scale-105 transition-all text-sm"

          onClick={() => {

           const response: Message = {

            id: Date.now().toString(),

            content: option,

            sender: 'user',

            timestamp: new Date(),

            type: 'text'

           };

           setMessages(prev => [...prev, response]);

          }}

         >

          {option}

         </Button>

        ))}

       </div>

      )}

       

      {/* Resource Suggestions */}

      {message.metadata?.resourceTitle && (

       <Card className="mt-4 p-3 border-0 bg-white/50">

        <div className="flex items-center gap-2">

         <BookOpen className="h-4 w-4 text-trust-blue" />

         <span className="text-sm font-medium text-charcoal">

          Suggested Resource: {message.metadata.resourceTitle}

         </span>

        </div>

        {message.metadata.resourceLink && (

         <Link 

          to={message.metadata.resourceLink}

          className="text-xs text-trust-blue hover:text-trust-blue/80 underline mt-1 block"

         >

          Learn more →

         </Link>

        )}

       </Card>

      )}

     </div>

      

     <div className={`text-xs text-muted-foreground mt-2 flex items-center gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>

      <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

      {isUser && <CheckCircle className="h-3 w-3 text-secondary" />}

     </div>

    </div>

   </div>

  );

 };



 return (

  <>

   <ConsentModal

    isOpen={isConsentOpen}

    onClose={() => {

     if (!isInitialConsentRequired) {

      setIsConsentOpen(false);

     }

    }}

    onConsent={handleConsent}

   />

   {!isConsentOpen && (

    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">

   {/* Consent Banner */}
   {!isConsentOpen && (
    <div className={`border-b border-border transition-all duration-300 ${
     localStorage.getItem('chat_summary_consent') === 'allowed'
      ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200'
      : 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
    }`}>
     <div className="max-w-4xl mx-auto px-4 py-3">
      <div className="flex items-center justify-center gap-2">
       <Shield className={`h-4 w-4 ${
        localStorage.getItem('chat_summary_consent') === 'allowed' ? 'text-green-600' : 'text-blue-600'
       }`} />
       <span className={`text-sm font-medium ${
        localStorage.getItem('chat_summary_consent') === 'allowed' ? 'text-green-800' : 'text-blue-800'
       }`}>
        {localStorage.getItem('chat_summary_consent') === 'allowed' 
         ? 'Summary sharing enabled' 
         : 'Private mode - no sharing'}
       </span>
      </div>
     </div>
    </div>
   )}

   {/* Header - More personality */}

   <header className={`border-b border-border sticky top-0 z-40 transition-all duration-300 ${

    isCrisisDetected 

     ? 'bg-gradient-to-r from-destructive/10 to-destructive/5 backdrop-blur-md' 

     : 'bg-card/95 backdrop-blur-md'

   }`}>

    <div className="max-w-4xl mx-auto px-4 py-4">

     <div className="flex items-center justify-between">

      <div className="flex items-center gap-4">

       <Link to="/dashboard">

        <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">

         <ArrowLeft className="h-4 w-4" />

        </Button>

       </Link>

        

       <div className="flex items-center gap-4">

        <div className="relative">

         <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">

          <Heart className="h-6 w-6 text-secondary" />

         </div>

         <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-background"></div>

        </div>

        <div>

         <h1 className="font-semibold text-foreground flex items-center gap-2">

          {assessmentMode ? 'Wellness Check-in ✨' : 'Chat with Bestie 💙'}

         </h1>

         <div className="flex items-center gap-2 text-sm">

          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>

          <span className="text-secondary font-medium">Always here for you</span>

         </div>

        </div>

       </div>

      </div>

       

      <div className="flex items-center gap-2">

       {isCrisisDetected && (

        <Badge className="bg-destructive text-white animate-pulse">

         <AlertTriangle className="h-3 w-3 mr-1" />

         Crisis Support Active

        </Badge>

       )}

        


       <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">

        <MoreVertical className="h-4 w-4" />

       </Button>

      </div>

     </div>

    </div>

   </header>



   {/* Crisis Alert Banner - Enhanced */}

   {isCrisisDetected && (

    <div className="bg-gradient-to-r from-destructive to-destructive/90 text-white p-4 shadow-lg">

     <div className="max-w-4xl mx-auto">

      <div className="flex items-center gap-4">

       <Shield className="h-6 w-6 flex-shrink-0 animate-pulse" />

       <div className="flex-1">

        <p className="font-semibold">Crisis Support Resources Available 🆘</p>

        <p className="text-sm opacity-90">

         Your safety is our top priority. Professional help is available 24/7 💙

        </p>

       </div>

       <Link to="/crisis">

        <Button variant="secondary" size="sm" className="bg-white text-destructive hover:bg-white/90 hover:scale-105 transition-all">

         Get Help Now

        </Button>

       </Link>

      </div>

     </div>

    </div>

   )}



   {/* Chat Messages */}

   <div className="flex-1 overflow-hidden">

    <div className="max-w-4xl mx-auto h-full flex flex-col">

     <div className="flex-1 overflow-y-auto p-6 space-y-4">

      {messages.map(renderMessage)}

       

      {/* Typing Indicator - Enhanced */}

      {isTyping && (

       <div className="flex justify-start mb-4">

        <div className="max-w-[85%]">

         <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">

          <div className="w-8 h-8 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center">

           <Heart className="h-4 w-4 text-secondary" />

          </div>

          <span className="font-medium">Bestie</span>

         </div>

         <div className="bg-gradient-to-r from-card to-muted/50 p-4 rounded-2xl mr-8 shadow-lg border">

          <div className="flex items-center gap-2">

           <div className="flex gap-1">

            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce"></div>

            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>

            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>

           </div>

           <span className="ml-2 text-sm text-muted-foreground">Bestie is thinking...</span>

           <Sparkles className="h-4 w-4 text-accent animate-spin" />

          </div>

         </div>

        </div>

       </div>

      )}

       

      <div ref={messagesEndRef} />

     </div>

    </div>

   </div>



   {/* Input Area - Enhanced */}

   <div className="border-t border-border bg-card/95 backdrop-blur-md p-4 shadow-2xl">

    <div className="max-w-4xl mx-auto">

     <div className="flex items-end gap-4">

      <div className="flex-1">

       <div className="relative">

        <Input

         value={inputValue}

         onChange={(e) => setInputValue(e.target.value)}

         onKeyPress={handleKeyPress}

         placeholder="Type your message... (Press Enter to send) 💭"

         className="pr-24 py-4 text-base border-border/50 focus:border-primary rounded-2xl shadow-lg bg-background/50"

         disabled={isTyping}

        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">

         <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform">

          <Smile className="h-4 w-4 text-muted-foreground" />

         </Button>

         <Button variant="ghost" size="sm" className="p-2 hover:scale-110 transition-transform">

          <Mic className="h-4 w-4 text-muted-foreground" />

         </Button>

        </div>

       </div>

       <p className="text-xs text-muted-foreground mt-2 flex items-center gap-2">

        <Shield className="h-3 w-3" />

        Your conversations are private and encrypted. Bestie is AI-powered support ✨

       </p>

      </div>

       

      <Button

       onClick={handleSendMessage}

       disabled={!inputValue.trim() || isTyping}

       size="lg"

       className="bg-primary hover:bg-primary/90 text-white px-6 py-4 rounded-2xl shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"

      >

       <Send className="h-5 w-5" />

      </Button>

     </div>

    </div>

   </div>



   {/* Quick Actions - More engaging */}

   {!assessmentMode && messages.length <= 2 && (

    <div className="border-t border-border bg-muted/30 p-4">

     <div className="max-w-4xl mx-auto">

      <div className="flex items-center gap-2 mb-4">

       <Coffee className="h-4 w-4 text-accent" />

       <p className="text-sm text-muted-foreground font-medium">Quick conversation starters:</p>

      </div>

      <div className="flex flex-wrap gap-3">

       <Button

        variant="outline"

        size="sm"

        onClick={() => setInputValue("I'm feeling stressed about exams 📚")}

        className="border-primary text-primary hover:bg-primary/5 hover:scale-105 transition-all"

       >

        <Star className="h-3 w-3 mr-2" />

        Exam stress

       </Button>

       <Button

        variant="outline"

        size="sm"

        onClick={() => setInputValue("I'm having trouble sleeping 😴")}

        className="border-secondary text-secondary hover:bg-secondary/5 hover:scale-105 transition-all"

       >

        <Moon className="h-3 w-3 mr-2" />

        Sleep issues

       </Button>

       <Button

        variant="outline"

        size="sm"

        onClick={() => setInputValue("I want to learn coping strategies ✨")}

        className="border-violet-500 text-violet-500 hover:bg-violet-500/5 hover:scale-105 transition-all"

       >

        <Zap className="h-3 w-3 mr-2" />

        Coping strategies

       </Button>

       <Button

        variant="outline"

        size="sm"

        onClick={() => setInputValue("I feel lonely 🫂")}

        className="border-accent text-accent hover:bg-accent/5 hover:scale-105 transition-all"

       >

        <Heart className="h-3 w-3 mr-2" />

        Feeling lonely

       </Button>

      </div>

     </div>

    </div>

   )}



   {/* Bottom Navigation for Mobile */}

   <div className="md:hidden">

    <Navigation />

   </div>

    </div>

   )}

  </>

 );

}