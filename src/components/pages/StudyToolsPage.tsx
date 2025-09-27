import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Brain,
  Coffee,
  Target,
  Music,
  BookOpen,
  CheckCircle,
  RotateCcw,
  Volume2,
  VolumeX,
  Timer,
  Calendar,
  Users,
  Zap,
  Heart,
  Lightbulb,
  TrendingUp,
  Sun
} from 'lucide-react';
import Navigation from '../shared/Navigation';

const focusTechniques = [
  {
    id: 'pomodoro',
    name: 'Pomodoro Technique',
    description: '25 min focus + 5 min break',
    duration: 25,
    breakDuration: 5,
    color: 'primary',
    icon: Timer
  },
  {
    id: 'deep-work',
    name: 'Deep Work Session',
    description: '90 min intense focus',
    duration: 90,
    breakDuration: 15,
    color: 'secondary',
    icon: Brain
  },
  {
    id: 'short-burst',
    name: 'Short Burst',
    description: '15 min quick session',
    duration: 15,
    breakDuration: 3,
    color: 'accent',
    icon: Zap
  }
];

const ambientSounds = [
  { id: 'rain', name: 'Rain', emoji: '🌧️', isPlaying: false },
  { id: 'forest', name: 'Forest', emoji: '🌲', isPlaying: false },
  { id: 'coffee', name: 'Coffee Shop', emoji: '☕', isPlaying: false },
  { id: 'library', name: 'Library', emoji: '📚', isPlaying: true },
  { id: 'waves', name: 'Ocean Waves', emoji: '🌊', isPlaying: false },
  { id: 'white-noise', name: 'White Noise', emoji: '⚪', isPlaying: false }
];

const categories = [
  {
    id: 'anxiety-stress',
    title: 'Anxiety & Stress',
    resources: 24,
    description: 'Coping strategies and relaxation techniques',
    icon: Heart,
    color: 'text-red-500' 
  },
  {
    id: 'depression-support',
    title: 'Depression Support',
    resources: 18,
    description: 'Understanding and managing depression',
    icon: Lightbulb,
    color: 'text-blue-500'
  },
  {
    id: 'study-focus',
    title: 'Study & Focus',
    resources: 32,
    description: 'Academic success and productivity tips',
    icon: BookOpen,
    color: 'text-green-500'
  },
  {
    id: 'sleep-wellness',
    title: 'Sleep & Wellness',
    resources: 15,
    description: 'Better sleep and self-care practices',
    icon: Sun,
    color: 'text-purple-500'
  },
  {
    id: 'relationships',
    title: 'Relationships',
    resources: 21,
    description: 'Social connections and communication',
    icon: Users,
    color: 'text-pink-500'
  },
  {
    id: 'career-future',
    title: 'Career & Future',
    resources: 19,
    description: 'Career planning and future goals',
    icon: TrendingUp,
    color: 'text-orange-500'
  }
];

export default function StudyToolsPage() {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [currentSound, setCurrentSound] = useState('library');
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && activeSession) {
      if (isBreak) {
        setIsBreak(false);
        setTimeRemaining(activeSession.duration * 60);
        setSessionCount(sessionCount + 1);
      } else {
        setIsBreak(true);
        setTimeRemaining(activeSession.breakDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, activeSession, isBreak, sessionCount]);

  const startSession = (technique: any) => {
    setActiveSession(technique);
    setTimeRemaining(technique.duration * 60);
    setIsRunning(true);
    setIsBreak(false);
    setSessionCount(0);
  };

  const pauseSession = () => {
    setIsRunning(!isRunning);
  };

  const stopSession = () => {
    setActiveSession(null);
    setTimeRemaining(0);
    setIsRunning(false);
    setIsBreak(false);
    setSessionCount(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSound = (soundId: string) => {
    setCurrentSound(currentSound === soundId ? '' : soundId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mm-gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="mm-text-h2 text-foreground">Study Tools</h1>
              <p className="mm-text-small text-muted-foreground">
                Boost your productivity with proven techniques
              </p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-primary" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Active Session Display */}
        {activeSession && (
          <Card className="mm-card mm-p-6 mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
            <div className="flex items-center justify-center mm-gap-2 mb-4">
              <activeSession.icon className="h-6 w-6 text-primary" />
              <h2 className="mm-text-h2 text-foreground">{activeSession.name}</h2>
            </div>
            
            {isBreak ? (
              <div className="mb-4">
                <Badge className="bg-secondary text-white mb-2">Break Time! 🌱</Badge>
                <p className="mm-text-small text-muted-foreground">Take a breather, you're doing great!</p>
              </div>
            ) : (
              <div className="mb-4">
                <Badge className="bg-primary text-white mb-2">Focus Session 🎯</Badge>
                <p className="mm-text-small text-muted-foreground">Stay focused, you've got this!</p>
              </div>
            )}

            <div className="mm-text-h1 text-foreground font-bold mb-4">
              {formatTime(timeRemaining)}
            </div>

            <div className="mb-6">
              <Progress 
                value={((activeSession.duration * 60 - timeRemaining) / (activeSession.duration * 60)) * 100} 
                className="h-3"
              />
            </div>

            <div className="flex justify-center mm-gap-3">
              <Button onClick={pauseSession} variant="outline" size="lg">
                {isRunning ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                {isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button onClick={stopSession} variant="outline" size="lg">
                <Square className="h-5 w-5 mr-2" />
                Stop
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-center mm-gap-4 mm-text-small text-muted-foreground">
              <div>Sessions: {sessionCount}</div>
              <div>•</div>
              <div>Technique: {activeSession.name}</div>
            </div>
          </Card>
        )}

        {/* Focus Techniques */}
        {!activeSession && (
          <div className="mb-8">
            <h2 className="mm-text-h2 text-foreground mb-4 flex items-center mm-gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Focus Techniques
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {focusTechniques.map((technique) => (
                <Card 
                  key={technique.id} 
                  className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer"
                  onClick={() => startSession(technique)}
                >
                  <div className="flex items-center mm-gap-3 mb-3">
                    <div className={`w-12 h-12 bg-${technique.color}/20 rounded-xl flex items-center justify-center`}>
                      <technique.icon className={`h-6 w-6 text-${technique.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="mm-text-h3 text-foreground">{technique.name}</h3>
                      <p className="mm-text-small text-muted-foreground">{technique.description}</p>
                    </div>
                  </div>
                  <Button className="w-full mm-btn-primary">
                    <Play className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Ambient Sounds */}
        <div className="mb-8">
          <h2 className="mm-text-h2 text-foreground mb-4 flex items-center mm-gap-2">
            <Music className="h-5 w-5 text-secondary" />
            Focus Sounds
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ambientSounds.map((sound) => (
              <Card 
                key={sound.id}
                className={`mm-card mm-p-3 cursor-pointer transition-all ${
                  currentSound === sound.id 
                    ? 'border-primary bg-primary/10' 
                    : 'hover:bg-muted/30'
                }`}
                onClick={() => toggleSound(sound.id)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{sound.emoji}</div>
                  <div className="mm-text-small font-medium text-foreground">{sound.name}</div>
                  {currentSound === sound.id && (
                    <Badge className="bg-primary text-white mm-text-xs mt-1">Playing</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* New "Browse by Category" section with updated styling */}
        <div className="mb-8">
          <h2 className="mm-text-h2 text-foreground mb-4 flex items-center mm-gap-2">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.id} 
                to={`/study-tools/category/${category.id}`}
                className="block"
              >
                <Card 
                  className="p-4 flex flex-col gap-3 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${category.color} bg-background/20`}>
                      <category.icon className={`h-6 w-6`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-base leading-tight">{category.title}</h3>
                      <p className="text-xs text-muted-foreground leading-none">{category.resources} resources</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {category.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  );
}