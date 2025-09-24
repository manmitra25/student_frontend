import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ThemeToggle } from '../ui/theme-toggle';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Users, 
  PenTool,
  Heart,
  Shield,
  LogOut,
  Clock,
  Star,
  Brain,
  Target,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Coffee,
  Moon,
  Sun,
  Sparkles,
  Zap,
  CheckCircle,
  BarChart3,
  BookMarked,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../App';
import Navigation from '../shared/Navigation';
import { downloadCounselorPdf } from '../../api/services/reports';

const moodOptions = [
  { emoji: '😊', label: 'Energized', value: 5, color: 'text-secondary' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'text-primary' },
  { emoji: '😐', label: 'Neutral', value: 3, color: 'text-muted-foreground' },
  { emoji: '😕', label: 'Stressed', value: 2, color: 'text-accent' },
  { emoji: '😰', label: 'Overwhelmed', value: 1, color: 'text-destructive' }
];

const quickActions = [
  { label: 'Quick Assessment', icon: CheckCircle, path: '/assessment', color: 'secondary' },
  { label: 'Study Break', icon: Coffee, path: '/study-break', color: 'accent' },
  { label: 'Crisis Support', icon: Shield, path: '/crisis', color: 'destructive' },
  { label: 'Peer Chat', icon: Users, path: '/community', color: 'violet-500' }
];

export default function Dashboard() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayProgress] = useState({
    mood: 3,
    studyHours: 4.5,
    targetHours: 6,
    completedTasks: 3,
    totalTasks: 5
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const firstName = user?.name.split(' ')[0] || user?.name;
    
    if (hour < 6) return { text: `Burning the midnight oil, ${firstName}?`, subtitle: "Remember to get some rest 🌙", icon: Moon };
    if (hour < 12) return { text: `Good morning, ${firstName}!`, subtitle: "Ready to crush today's goals? ☀️", icon: Sun };
    if (hour < 17) return { text: `Hey ${firstName}!`, subtitle: "How's your day treating you? ⚡", icon: Zap };
    if (hour < 21) return { text: `Evening, ${firstName}!`, subtitle: "Time to wind down and reflect ✨", icon: Sparkles };
    return { text: `Late night, ${firstName}?`, subtitle: "Don't forget self-care 🌙", icon: Moon };
  };

  const greeting = getGreeting();

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
    // TODO: Save to backend and trigger relevant resources
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header with Progress */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center mm-gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center">
                <greeting.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="mm-text-h2 text-foreground">{greeting.text}</h1>
                <p className="mm-text-small text-muted-foreground">{greeting.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center mm-gap-2">
              <ThemeToggle />
              <Link to="/crisis">
                <Button size="sm" className="crisis-support mm-btn-sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Help
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Today's Progress Summary */}
          <div className="grid grid-cols-3 mm-gap-3 mb-4">
            <div className="bg-secondary/10 rounded-xl p-3 text-center">
              <div className="mm-text-h3 text-secondary font-bold">{todayProgress.studyHours}h</div>
              <div className="mm-text-xs text-muted-foreground">Study Time</div>
            </div>
            <div className="bg-primary/10 rounded-xl p-3 text-center">
              <div className="mm-text-h3 text-primary font-bold">{todayProgress.completedTasks}/{todayProgress.totalTasks}</div>
              <div className="mm-text-xs text-muted-foreground">Tasks Done</div>
            </div>
            <div className="bg-accent/10 rounded-xl p-3 text-center">
              <div className="mm-text-h3 text-accent font-bold">
                {selectedMood ? moodOptions.find(m => m.value === selectedMood)?.emoji : '😐'}
              </div>
              <div className="mm-text-xs text-muted-foreground">Current Mood</div>
            </div>
          </div>

          {/* Quick Mood Check */}
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="mm-text-small text-foreground mb-3 flex items-center mm-gap-2">
              <Heart className="h-4 w-4 text-accent" />
              How are you feeling right now? <span className="text-muted-foreground">(helps us personalize your experience)</span>
            </p>
            <div className="flex mm-gap-2">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-2 rounded-lg transition-all ${
                    selectedMood === mood.value
                      ? 'bg-primary/20 scale-110 shadow-lg'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <span className="text-xl">{mood.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Quick Actions Bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.path}>
              <Button 
                variant="outline" 
                className={`w-full flex-col h-16 border-${action.color}/20 text-${action.color} hover:bg-${action.color}/5`}
              >
                <action.icon className="h-5 w-5 mb-1" />
                <span className="mm-text-xs">{action.label}</span>
              </Button>
            </Link>
          ))}
          <Button 
            variant="outline"
            className="w-full flex-col h-16 border-secondary/20 text-secondary hover:bg-secondary/5"
            onClick={() => downloadCounselorPdf().catch(err => alert('PDF download failed'))}
          >
            <BarChart3 className="h-5 w-5 mb-1" />
            <span className="mm-text-xs">Download Counselor PDF</span>
          </Button>
        </div>

        {/* Core Features - Student-Focused */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          
          {/* AI Study Buddy */}
          <Link to="/chat">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <Badge className="bg-primary text-white mm-text-xs">AI Powered</Badge>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-2">Study Buddy AI</h3>
              <p className="mm-text-small text-muted-foreground">Get instant help with academics, stress, and life challenges</p>
            </Card>
          </Link>

          {/* Academic Counseling */}
          <Link to="/booking">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-secondary/10 to-secondary/5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex items-center mm-gap-1 mm-text-xs text-secondary">
                  <Clock className="h-3 w-3" />
                  3 available
                </div>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-2">Expert Counselors</h3>
              <p className="mm-text-small text-muted-foreground">Book sessions with licensed counselors who understand student life</p>
            </Card>
          </Link>

          {/* Study Resources & Tools */}
          <Link to="/study-tools">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-accent" />
                </div>
                <Badge className="bg-accent text-white mm-text-xs">New!</Badge>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-2">Study Tools</h3>
              <p className="mm-text-small text-muted-foreground">Pomodoro timers, focus music, and productivity techniques</p>
            </Card>
          </Link>

          {/* Academic Performance */}
          <Link to="/academic-tracking">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-violet-500/10 to-violet-500/5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-violet-500" />
                </div>
                <Badge className="bg-violet-500 text-white mm-text-xs">Track</Badge>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-2">Academic Tracker</h3>
              <p className="mm-text-small text-muted-foreground">Monitor your academic progress and mental wellness</p>
            </Card>
          </Link>

          {/* Career Guidance */}
          <Link to="/career-guidance">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-emerald-500" />
                </div>
                <Badge className="bg-emerald-500 text-white mm-text-xs">Career</Badge>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-2">Career Guidance</h3>
              <p className="mm-text-small text-muted-foreground">Explore careers, build skills, and plan your future</p>
            </Card>
          </Link>

          {/* Student Community */}
          <Link to="/community">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-pink-500/10 to-pink-500/5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-pink-500" />
                </div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-2">Student Community</h3>
              <p className="mm-text-small text-muted-foreground">Connect anonymously with peers facing similar challenges</p>
            </Card>
          </Link>
        </div>

        {/* Wellness Resources */}
        <div className="mb-8">
          <div className="flex items-center mm-gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-accent" />
            <h2 className="mm-text-h2 text-foreground">Wellness Resources</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link to="/resources/stress-management">
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Brain className="h-5 w-5 text-red-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">Stress Relief</h4>
              </Card>
            </Link>
            <Link to="/resources/study-techniques">
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <BookMarked className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">Study Tips</h4>
              </Card>
            </Link>
            <Link to="/resources/mindfulness">
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Heart className="h-5 w-5 text-green-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">Mindfulness</h4>
              </Card>
            </Link>
            <Link to="/resources/sleep-wellness">
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Moon className="h-5 w-5 text-purple-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">Sleep Better</h4>
              </Card>
            </Link>
          </div>
        </div>

        {/* Personal Journal & Tracking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/journal">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <div className="flex items-center mm-gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <PenTool className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mm-text-h3 text-foreground">Personal Journal</h3>
                  <p className="mm-text-small text-muted-foreground">Track thoughts, gratitude, and daily reflections</p>
                </div>
                {selectedMood && (
                  <div className="text-right">
                    <div className="mm-text-xs text-muted-foreground">Today's mood</div>
                    <span className="text-xl">{moodOptions.find(m => m.value === selectedMood)?.emoji}</span>
                  </div>
                )}
              </div>
            </Card>
          </Link>

          <Link to="/progress">
            <Card className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
              <div className="flex items-center mm-gap-3">
                <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mm-text-h3 text-foreground">Progress Tracker</h3>
                  <p className="mm-text-small text-muted-foreground">See your wellness and academic journey</p>
                </div>
                <div className="text-right">
                  <div className="mm-text-xs text-muted-foreground">This week</div>
                  <div className="mm-text-small font-medium text-indigo-500">+12% improvement</div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Motivational Message Based on Mood */}
        {selectedMood && (
          <Card className="mm-card mm-p-4 bg-gradient-to-r from-primary/5 to-secondary/5 text-center">
            <div className="flex items-center justify-center mm-gap-2 mb-3">
              <Heart className="h-6 w-6 text-accent" />
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <p className="mm-text-body text-foreground">
              {selectedMood >= 4 ? "You're radiating positive energy today! Keep that momentum going 🌟" :
               selectedMood === 3 ? "It's okay to have neutral days. Small steps still count 💙" :
               selectedMood === 2 ? "Feeling stressed? Remember, this is temporary. You've got support here 🫂" :
               "Tough times are hard, but you're tougher. You're not alone in this journey 💪"}
            </p>
            {selectedMood <= 2 && (
              <div className="flex justify-center mm-gap-3 mt-4">
                <Link to="/chat">
                  <Button size="sm" className="mm-btn-primary">
                    Talk to AI Buddy
                  </Button>
                </Link>
                <Link to="/crisis">
                  <Button size="sm" variant="outline" className="border-destructive text-destructive">
                    Get Help Now
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        )}
      </main>

      {/* Enhanced Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  );
}