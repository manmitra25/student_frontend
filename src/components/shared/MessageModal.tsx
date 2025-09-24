import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { 
  X, 
  Send, 
  User,
  ArrowLeft
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'counselor';
  timestamp: Date;
}

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  counselorName: string;
  counselorId: string;
}

export default function MessageModal({ 
  isOpen, 
  onClose, 
  counselorName, 
  counselorId 
}: MessageModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm ${counselorName}. I'm here to support you. How can I help you today?`,
      sender: 'counselor',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate counselor response
    setTimeout(() => {
      const responses = [
        "Thank you for sharing that with me. I understand this is important to you.",
        "I appreciate you being open about your feelings. Let's work through this together.",
        "That sounds challenging. I'm here to support you through this.",
        "I can see this is affecting you. Would you like to explore some coping strategies?",
        "Thank you for trusting me with this information. You're taking positive steps."
      ];

      const counselorResponse: Message = {
        id: Date.now().toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'counselor',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, counselorResponse]);
      setIsTyping(false);
    }, 1500);
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
      <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-2'}`}>
          {!isUser && (
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-primary" />
              </div>
              <span className="font-medium">{counselorName}</span>
            </div>
          )}
          
          <div className={`p-3 rounded-2xl transition-all ${
            isUser 
              ? 'bg-primary text-white ml-4 shadow-lg' 
              : 'bg-card border mr-4 shadow-sm'
          }`}>
            <p className={`${isUser ? 'text-white' : 'text-foreground'} leading-relaxed text-sm`}>
              {message.content}
            </p>
          </div>
          
          <div className={`text-xs text-muted-foreground mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-md sm:max-w-lg max-h-[95vh] overflow-hidden bg-card">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground text-sm">{counselorName}</h2>
                <p className="text-xs text-muted-foreground">Online now</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map(renderMessage)}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[85%]">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-primary" />
                    </div>
                    <span className="font-medium">{counselorName}</span>
                  </div>
                  <div className="bg-card border p-3 rounded-2xl mr-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="ml-2 text-xs text-muted-foreground">Typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4 flex-shrink-0">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="text-sm border-border/50 focus:border-primary rounded-xl"
                  disabled={isTyping}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white px-3 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Messages are secure and private
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
