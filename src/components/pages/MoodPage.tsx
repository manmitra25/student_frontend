import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Heart,
  Moon,
  Apple,
  Dumbbell,
  BookOpen,
  Brain,
  CheckCircle2,
  Settings,
  ChevronRight,
  Target,
  Flame,
  AlertTriangle,
  Frown,
} from 'lucide-react';
import Navigation from '../shared/Navigation';
import LanguageToggle from '../shared/LanguageToggle';
import { useLanguage } from '../shared/LanguageProvider';

type Language = 'en' | 'hi';

const moodOptions = [
  { value: 1, emoji: '😰', label: { en: 'Struggling', hi: 'संघर्ष कर रहे हैं' } },
  { value: 2, emoji: '😕', label: { en: 'Low', hi: 'उदास' } },
  { value: 3, emoji: '😐', label: { en: 'Okay', hi: 'ठीक' } },
  { value: 4, emoji: '🙂', label: { en: 'Good', hi: 'अच्छा' } },
  { value: 5, emoji: '😊', label: { en: 'Great', hi: 'बहुत अच्छा' } },
];

const habitItems = [
  { id: 'sleep', label: { en: 'Good Sleep', hi: 'अच्छी नींद' }, icon: Moon, color: 'purple' },
  { id: 'food', label: { en: 'Healthy Food', hi: 'स्वस्थ भोजन' }, icon: Apple, color: 'green' },
  { id: 'exercise', label: { en: 'Exercise', hi: 'व्यायाम' }, icon: Dumbbell, color: 'blue' },
  { id: 'study', label: { en: 'Study Focus', hi: 'अध्ययन पर ध्यान' }, icon: BookOpen, color: 'amber' },
];

const wellnessTests = [
  {
    id: 'gad7',
    name: { en: 'Are You Anxious?', hi: 'क्या आप चिंतित हैं?' },
    description: { en: '7 quick questions (GAD‑7 style)', hi: '7 त्वरित प्रश्न (GAD‑7 शैली)' },
    progress: 0,
    color: 'orange',
    icon: AlertTriangle,
  },
  {
    id: 'phq9',
    name: { en: 'Are You Depressed?', hi: 'क्या आप उदास हैं?' },
    description: { en: '9 quick questions (PHQ‑9 style)', hi: '9 त्वरित प्रश्न (PHQ‑9 शैली)' },
    progress: 0,
    color: 'red',
    icon: Frown,
  },
  {
    id: 'burnout',
    name: { en: 'Burnout', hi: 'थकान' },
    description: { en: 'Academic/work strain check', hi: 'शैक्षणिक/कार्य तनाव जाँच' },
    progress: 0,
    color: 'violet',
    icon: Target,
  },
  {
    id: 'stress',
    name: { en: 'Are You Stressed?', hi: 'क्या आप तनाव में हैं?' },
    description: { en: '7 quick questions', hi: '7 त्वरित प्रश्न' },
    progress: 0,
    color: 'blue',
    icon: Brain,
  },
];

const learnCards = [
  {
    id: 'stress-relief',
    to: '/resources/stress-management',
    icon: Brain,
    gradient: 'from-red-50 to-red-100',
    hoverGradient: 'hover:from-red-100 hover:to-red-150',
    iconColor: 'text-red-600',
    title: { en: 'Stress Relief', hi: 'तनाव से राहत' },
    subtitle: { en: '5 min read', hi: '5 मिनट पढ़ें' },
    titleColor: 'text-red-800',
    subtitleColor: 'text-red-600',
  },
  {
    id: 'better-sleep',
    to: '/resources/sleep-wellness',
    icon: Moon,
    gradient: 'from-purple-50 to-purple-100',
    hoverGradient: 'hover:from-purple-100 hover:to-purple-150',
    iconColor: 'text-purple-600',
    title: { en: 'Better Sleep', hi: 'बेहतर नींद' },
    subtitle: { en: '3 min read', hi: '3 मिनट पढ़ें' },
    titleColor: 'text-purple-800',
    subtitleColor: 'text-purple-600',
  },
];

const quickActions = [
  {
    id: 'journal',
    to: '/journal',
    icon: Heart,
    gradient: 'from-primary/10 to-primary/20',
    hoverGradient: 'hover:from-primary/20 hover:to-primary/30',
    iconColor: 'text-primary',
    title: { en: 'Journal', hi: 'जर्नल' },
    subtitle: { en: 'Reflect on your day', hi: 'अपने दिन पर विचार करें' },
  },
  {
    id: 'resources',
    to: '/resources',
    icon: BookOpen,
    gradient: 'from-secondary/10 to-secondary/20',
    hoverGradient: 'hover:from-secondary/20 hover:to-secondary/30',
    iconColor: 'text-secondary',
    title: { en: 'Resources', hi: 'संसाधन' },
    subtitle: { en: 'Wellness tools', hi: 'वेलनेस उपकरण' },
  },
];

const translations: Record<Language, {
  headerTitle: string;
  headerSubtitle: string;
  stats: {
    streak: string;
    mood: string;
    habits: string;
  };
  todaysMoodTitle: string;
  gratitude: string;
  dailyHabitsTitle: string;
  habitsProgress: (completed: number, total: number) => string;
  wellnessTestsTitle: string;
  viewAll: string;
  start: string;
  testProgress: (progress: number) => string;
  learnGrowTitle: string;
  browseAll: string;
}> = {
  en: {
    headerTitle: 'Mood Check',
    headerSubtitle: 'How are you feeling today?',
    stats: {
      streak: 'Day streak',
      mood: "Today's mood",
      habits: 'Habits',
    },
    todaysMoodTitle: "Today's Mood",
    gratitude: 'Thanks for sharing! Your mood helps us understand your wellbeing patterns.',
    dailyHabitsTitle: 'Daily Habits',
    habitsProgress: (completed, total) => `${completed}/${total} done`,
    wellnessTestsTitle: 'Wellness Tests',
    viewAll: 'View all',
    start: 'Start',
    testProgress: (progress) => `${progress}% done`,
    learnGrowTitle: 'Learn & Grow',
    browseAll: 'Browse all',
  },
  hi: {
    headerTitle: 'मूड चेक',
    headerSubtitle: 'आज आप कैसा महसूस कर रहे हैं?',
    stats: {
      streak: 'दिनों की श्रृंखला',
      mood: 'आज का मूड',
      habits: 'आदतें',
    },
    todaysMoodTitle: 'आज का मूड',
    gratitude: 'साझा करने के लिए धन्यवाद! आपका मूड हमें आपकी भलाई के पैटर्न समझने में मदद करता है।',
    dailyHabitsTitle: 'दैनिक आदतें',
    habitsProgress: (completed, total) => `${completed}/${total} पूर्ण`,
    wellnessTestsTitle: 'वेलनेस टेस्ट',
    viewAll: 'सभी देखें',
    start: 'शुरू करें',
    testProgress: (progress) => `${progress}% पूर्ण`,
    learnGrowTitle: 'सीखें और बढ़ें',
    browseAll: 'सभी ब्राउज़ करें',
  },
};

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [habits, setHabits] = useState<Record<string, boolean>>({});
  const [streak, setStreak] = useState(7);
  const { language } = useLanguage();
  const t = translations[language];

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
            <h1 className="text-2xl font-semibold text-foreground font-poppins">{t.headerTitle}</h1>
            <p className="text-sm text-muted-foreground">{t.headerSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle showLabel={false} />
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Streak & Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="flex items-center justify-center mb-1">
              <Flame className="h-5 w-5 text-orange-500 mr-1" />
              <span className="text-lg font-semibold text-orange-700">{streak}</span>
            </div>
            <p className="text-xs text-orange-600">{t.stats.streak}</p>
          </Card>
          
          <Card className="p-3 text-center border-0 bg-gradient-to-br from-primary/10 to-primary/20">
            <div className="text-lg font-semibold text-primary mb-1">
              {averageMood.toFixed(1)}
            </div>
            <p className="text-xs text-primary">{t.stats.mood}</p>
          </Card>
          
          <Card className="p-3 text-center border-0 bg-gradient-to-br from-secondary/10 to-secondary/20">
            <div className="text-lg font-semibold text-secondary mb-1">
              {completedHabits}/4
            </div>
            <p className="text-xs text-secondary">{t.stats.habits}</p>
          </Card>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Daily Mood Tracker */}
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t.todaysMoodTitle}</h3>
            {selectedMood && (
              <Badge variant="outline" className="text-xs">
                {moodOptions.find((option) => option.value === selectedMood)?.label[language]}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-5 gap-3">
            {moodOptions.map(({ value, emoji }) => {
              const moodValue = value;
              const isSelected = selectedMood === moodValue;

              return (
                <button
                  key={moodValue}
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
                {t.gratitude}
              </p>
            </div>
          )}
        </Card>

        {/* Habit Check-ins */}
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t.dailyHabitsTitle}</h3>
            <span className="text-sm text-muted-foreground">{t.habitsProgress(completedHabits, habitItems.length)}</span>
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
                        {habit.label[language]}
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
        <Card className="p-6 border-0 shadow-sm" data-section="wellness-tests">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">{t.wellnessTestsTitle}</h3>
            <Link to="/assessment">
              <Button variant="ghost" size="sm">
                {t.viewAll}
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
                          <p className="font-medium text-foreground">{test.name[language]}</p>
                          <p className="text-xs text-muted-foreground">{test.description[language]}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {test.progress > 0 ? (
                          <Badge variant="outline" className="text-xs">
                            {t.testProgress(test.progress)}
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            {t.start}
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
            <h3 className="text-lg font-semibold text-foreground">{t.learnGrowTitle}</h3>
            <Link to="/resources">
              <Button variant="ghost" size="sm">
                {t.browseAll}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {learnCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link key={card.id} to={card.to}>
                  <Card className={`p-4 border-0 bg-gradient-to-br ${card.gradient} ${card.hoverGradient} transition-all cursor-pointer`}>
                    <Icon className={`h-6 w-6 ${card.iconColor} mb-2`} />
                    <p className={`font-medium ${card.titleColor} text-sm`}>{card.title[language]}</p>
                    <p className={`text-xs ${card.subtitleColor}`}>{card.subtitle[language]}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.id} to={action.to}>
                <Card className={`p-4 border-0 bg-gradient-to-br ${action.gradient} ${action.hoverGradient} transition-all cursor-pointer`}>
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${action.iconColor}`} />
                    <div>
                      <p className={`font-medium ${action.iconColor}`}>{action.title[language]}</p>
                      <p className="text-xs text-muted-foreground/80">{action.subtitle[language]}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  );
}


