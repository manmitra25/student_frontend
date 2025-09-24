import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Heart, 
  Moon, 
  Apple, 
  Dumbbell, 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Brain,
  Smile,
  CheckCircle2,
  Settings,
  ChevronRight,
  Target,
  Award,
  Flame
} from 'lucide-react';
import { useApp } from '../../App';
import Navigation from '../shared/Navigation';

const moodEmojis = ['😰', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Struggling', 'Low', 'Okay', 'Good', 'Great'];

const habitItems = [
  { id: 'sleep', label: 'Good Sleep', icon: Moon, color: 'purple' },
  { id: 'food', label: 'Healthy Food', icon: Apple, color: 'green' },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell, color: 'blue' },
  { id: 'study', label: 'Study Focus', icon: BookOpen, color: 'amber' }
];

const wellnessTests = [
  {
    id: 'phq9',
    name: 'PHQ-9',
    description: 'Depression screening',
    progress: 0,
    color: 'red',
    icon: Brain
  },
  {
    id: 'gad7',
    name: 'GAD-7', 
    description: 'Anxiety assessment',
    progress: 0,
    color: 'orange',
    icon: Heart
  },
  {
    id: 'burnout',
    name: 'Burnout',
    description: 'Academic stress check',
    progress: 0,
    color: 'violet',
    icon: Target
  }
];

export default function MoodPage() {
  const { user } = useApp();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [habits, setHabits] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(7);

  useEffect(() => {
    // Load saved mood from localStorage
    const savedMood = localStorage.getItem('todayMood');
    if (savedMood) {
      setSelectedMood(parseInt(savedMood));
    }
  }, []);

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    localStorage.setItem('todayMood', mood.toString());
  };

  const handleHabitToggle = (habitId: string) => {
    setHabits(prev => ({
      ...prev,
      [habitId]: !prev[habitId]
    }));
  };

  const completedHabits = Object.values(habits).filter(Boolean).length;
  const averageMood = selectedMood || 0;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground font-poppins">Mood Check</h1>
            <p className="text-sm text-muted-foreground">How are you feeling today?</p>
          </div>
          <Link to="/profile">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Streak & Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-5 w-5 text-orange-500 mr-1" />
              <span className="text-lg font-semibold text-orange-700">{streak}</span>
            </div>
            <p className="text-xs text-orange-600">Day streak</p>
          </Card>
          
          <Card className="p-3 text-center border-0 bg-gradient-to-br from-primary/10 to-primary/20">
            <div className="text-lg font-semibold text-primary mb-1">
              {averageMood.toFixed(1)}
            </div>
            <p className="text-xs text-primary">Today's mood</p>
          </Card>
          
          <Card className="p-3 text-center border-0 bg-gradient-to-br from-secondary/10 to-secondary/20">
            <div className="text-lg font-semibold text-secondary mb-1">
              {completedHabits}/4
            </div>
            <p className="text-xs text-secondary">Habits</p>
          </Card>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Daily Mood Tracker */}
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Today's Mood</h3>
            {selectedMood && (
              <Badge variant="outline" className="text-xs">
                {moodLabels[selectedMood - 1]}
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-5 gap-3">
            {moodEmojis.map((emoji, index) => {
              const moodValue = index + 1;
              const isSelected = selectedMood === moodValue;
              
              return (
                <button
                  key={index}
                  onClick={() => handleMoodSelect(moodValue)}
                  className={`aspect-square rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10 transform scale-110'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="text-2xl">{emoji}</div>
                </button>
              );
            })}
          </div>
          
          {selectedMood && (
            <div className="mt-4 p-3 bg-muted/30 rounded-xl">
              <p className="text-sm text-muted-foreground text-center">
                Thanks for sharing! Your mood helps us understand your wellbeing patterns.
              </p>
            </div>
          )}
        </Card>

        {/* Habit Check-ins */}
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Daily Habits</h3>
            <span className="text-sm text-muted-foreground">{completedHabits}/4 done</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {habitItems.map((habit) => {
              const Icon = habit.icon;
              const isCompleted = habits[habit.id];
              
              return (
                <button
                  key={habit.id}
                  onClick={() => handleHabitToggle(habit.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    isCompleted
                      ? `border-${habit.color}-400 bg-${habit.color}-50`
                      : 'border-border hover:border-muted-foreground'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted ? `bg-${habit.color}-100` : 'bg-muted'
                    }`}>
                      <Icon className={`h-4 w-4 ${
                        isCompleted ? `text-${habit.color}-600` : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        isCompleted ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {habit.label}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className={`h-5 w-5 text-${habit.color}-500`} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Wellness Tests */}
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Wellness Tests</h3>
            <Link to="/assessment">
              <Button variant="ghost" size="sm">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {wellnessTests.map((test) => {
              const Icon = test.icon;
              
              return (
                <Link key={test.id} to={`/assessment/${test.id}`}>
                  <Card className="p-4 border-0 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-${test.color}-100`}>
                          <Icon className={`h-4 w-4 text-${test.color}-600`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{test.name}</p>
                          <p className="text-xs text-muted-foreground">{test.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {test.progress > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            {test.progress}% done
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Learn Section */}
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Learn & Grow</h3>
            <Link to="/resources">
              <Button variant="ghost" size="sm">
                Browse all
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/resources/stress-management">
              <Card className="p-4 border-0 bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-150 transition-all cursor-pointer">
                <Brain className="h-6 w-6 text-red-600 mb-2" />
                <p className="font-medium text-red-800 text-sm">Stress Relief</p>
                <p className="text-xs text-red-600">5 min read</p>
              </Card>
            </Link>
            
            <Link to="/resources/sleep-wellness">
              <Card className="p-4 border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-150 transition-all cursor-pointer">
                <Moon className="h-6 w-6 text-purple-600 mb-2" />
                <p className="font-medium text-purple-800 text-sm">Better Sleep</p>
                <p className="text-xs text-purple-600">3 min read</p>
              </Card>
            </Link>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/journal">
            <Card className="p-4 border-0 bg-gradient-to-br from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 transition-all cursor-pointer">
              <div className="flex items-center space-x-3">
                <Heart className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-primary">Journal</p>
                  <p className="text-xs text-primary/80">Reflect on your day</p>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link to="/study-break">
            <Card className="p-4 border-0 bg-gradient-to-br from-secondary/10 to-secondary/20 hover:from-secondary/20 hover:to-secondary/30 transition-all cursor-pointer">
              <div className="flex items-center space-x-3">
                <Smile className="h-6 w-6 text-secondary" />
                <div>
                  <p className="font-medium text-secondary">Take a Break</p>
                  <p className="text-xs text-secondary/80">Mindful moments</p>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
