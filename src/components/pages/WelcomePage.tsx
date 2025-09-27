import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { ChevronRight, ChevronLeft, Shield, Heart, Users, MessageCircle, BookOpen, CheckCircle } from 'lucide-react';
import { useApp } from '../../App';

const welcomeCards = [
  {
    id: 1,
    title: "Welcome to Your Safe Space",
    description: "ManMitra is designed with your privacy and safety as our top priorities. Everything you share here is confidential and secure.",
    icon: Shield,
    color: "trust-blue",
    features: [
      "End-to-end encrypted conversations",
      "Anonymous community participation",
      "Professional counselor verification",
      "Crisis intervention protocols"
    ],
    bgGradient: "from-trust-blue/10 to-trust-blue/5"
  },
  {
    id: 2,
    title: "Professional Support When You Need It",
    description: "Connect with licensed mental health professionals who understand student life and cultural contexts.",
    icon: Heart,
    color: "healing-green",
    features: [
      "Licensed counselors and therapists",
      "Flexible scheduling options",
      "Crisis support available 24/7",
      "Cultural sensitivity training"
    ],
    bgGradient: "from-healing-green/10 to-healing-green/5"
  },
  {
    id: 3,
    title: "Community Connection & Growth",
    description: "You're not alone in this journey. Connect with peers who understand your experiences while maintaining complete privacy.",
    icon: Users,
    color: "soft-purple",
    features: [
      "Anonymous peer support groups",
      "Respectful community guidelines",
      "Volunteer moderators",
      "Optional participation always"
    ],
    bgGradient: "from-soft-purple/10 to-soft-purple/5"
  }
];

export default function WelcomePage() {
  const [currentCard, setCurrentCard] = useState(0);
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const nextCard = () => {
    if (currentCard < welcomeCards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleGetStarted = () => {
    if (user) {
      const updatedUser = { ...user, isNewUser: false } as const;
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as any);
    }
    navigate('/dashboard');
  };

  const handleSkip = () => {
    if (user) {
      const updatedUser = { ...user, isNewUser: false } as const;
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser as any);
    }
    navigate('/dashboard');
  };

  const currentWelcomeCard = welcomeCards[currentCard];
  const IconComponent = currentWelcomeCard.icon;

  return (
    <div className="min-h-screen bg-soft-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-trust-blue mb-2">
            Welcome to ManMitra, {user?.name}
          </h1>
          <p className="text-charcoal/70">
            Let's take a moment to show you around your new wellness space
          </p>
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {welcomeCards.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCard(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentCard ? 'bg-trust-blue' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Welcome Card */}
        <Card className={`p-8 border-0 shadow-xl bg-gradient-to-br ${currentWelcomeCard.bgGradient} relative overflow-hidden mb-8`}>
          <div className="relative z-10">
            <div className={`w-20 h-20 bg-${currentWelcomeCard.color}/20 rounded-full flex items-center justify-center mx-auto mb-6`}>
              <IconComponent className={`h-10 w-10 text-${currentWelcomeCard.color}`} />
            </div>

            <h2 className="text-center text-charcoal mb-4">
              {currentWelcomeCard.title}
            </h2>

            <p className="text-center text-charcoal/80 mb-8 leading-relaxed">
              {currentWelcomeCard.description}
            </p>

            <div className="grid gap-3 max-w-md mx-auto">
              {currentWelcomeCard.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <CheckCircle className={`h-5 w-5 text-${currentWelcomeCard.color} flex-shrink-0`} />
                  <span className="text-charcoal/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="outline"
            onClick={prevCard}
            disabled={currentCard === 0}
            className="border-gray-300 text-charcoal hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              {currentCard + 1} of {welcomeCards.length}
            </span>
          </div>

          {currentCard < welcomeCards.length - 1 ? (
            <Button
              onClick={nextCard}
              className="bg-trust-blue hover:bg-trust-blue/90 text-white"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleGetStarted}
              className="bg-healing-green hover:bg-healing-green/90 text-white"
            >
              Get Started
              <Heart className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Quick Start Options */}
        {currentCard === welcomeCards.length - 1 && (
          <Card className="p-6 border-0 shadow-lg bg-white">
            <h3 className="text-center text-charcoal mb-4">Ready to begin?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/chat')}
                className="border-trust-blue text-trust-blue hover:bg-trust-blue/5 flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat with Bestie
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/resources')}
                className="border-healing-green text-healing-green hover:bg-healing-green/5 flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Browse Resources
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/community')}
                className="border-soft-purple text-soft-purple hover:bg-soft-purple/5 flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Join Community
              </Button>
            </div>
          </Card>
        )}

        {/* Skip option */}
        <div className="text-center mt-6">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-charcoal underline"
          >
            Skip introduction
          </button>
        </div>
      </div>
    </div>
  );
}