import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "../ui/theme-toggle";
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
  UserCheck,
  BookOpenCheck,
  MessageSquare,
  User,
} from "lucide-react";
import { useApp } from "../../App";
import Navigation from "../shared/Navigation";
import { downloadCounselorPdf } from "../../api/services/reports";
import LanguageToggle from "../shared/LanguageToggle";
import { useLanguage } from "../shared/LanguageProvider";

const moodOptions = [
  { emoji: "😊", label: "Energized", value: 5, color: "text-secondary" },
  { emoji: "🙂", label: "Good", value: 4, color: "text-primary" },
  { emoji: "😐", label: "Neutral", value: 3, color: "text-muted-foreground" },
  { emoji: "😕", label: "Stressed", value: 2, color: "text-accent" },
  { emoji: "😰", label: "Overwhelmed", value: 1, color: "text-destructive" },
];

const quickActions = [
  {
    label: "Quick Assessment",
    icon: CheckCircle,
    path: "/mood",
    color: "secondary",
  },
  {
    label: "Resources",
    icon: BookOpenCheck,
    path: "/resources",
    color: "accent",
  },
  {
    label: "Crisis Support",
    icon: Shield,
    path: "/crisis",
    color: "destructive",
  },
  { label: "Peer Chat", icon: Users, path: "/community", color: "violet-500" },
];

const translations = {
  en: {
    quickAssessment: "Quick Assessment",
    resources: "Resources",
    crisisSupport: "Crisis Support",
    peerChat: "Peer Chat",
    studyTime: "Study Time",
    tasksDone: "Tasks Done",
    currentMood: "Current Mood",
    moodQuestion: "How are you feeling right now?",
    moodSubtitle: "(helps us personalize your experience)",
    moodLocked: "Mood locked for today • You can change it tomorrow",
    quickActionsTitle: "Quick Actions",
    bestieTitle: "Bestie",
    bestieDescription: "Your AI companion for academics, stress, and life challenges",
    counselorsTitle: "Connect with Counselors",
    counselorsDescription: "Book sessions with licensed counselors who understand student life",
    resourceHubTitle: "Resource Hub",
    resourceHubDescription: "Wellness resources, videos, and tools for your mental health journey",
    communityTitle: "Community",
    communityDescription: "Connect anonymously with peers facing similar challenges",
    wellnessResources: "Wellness Resources",
    stressRelief: "Stress Relief",
    studyTips: "Study Tips",
    mindfulness: "Mindfulness",
    sleepBetter: "Sleep Better",
    personalJournal: "Personal Journal",
    personalJournalDescription: "Track thoughts, gratitude, and daily reflections",
    progressTracker: "Progress Tracker",
    progressTrackerDescription: "See your wellness and academic journey",
    progressWeek: "This week",
    progressImprovement: "+12% improvement",
    lowMoodAction: {
      talkBuddy: "Talk to AI Buddy",
      getHelp: "Get Help Now",
    },
    languageLabel: "Language",
  },
  hi: {
    quickAssessment: "त्वरित मूल्यांकन",
    resources: "संसाधन",
    crisisSupport: "आपातकालीन सहायता",
    peerChat: "सहपाठी चैट",
    studyTime: "अध्ययन समय",
    tasksDone: "पूरे कार्य",
    currentMood: "वर्तमान मूड",
    moodQuestion: "आप अभी कैसा महसूस कर रहे हैं?",
    moodSubtitle: "(हमें आपके अनुभव को वैयक्तिकृत करने में मदद करता है)",
    moodLocked: "आज के लिए मूड लॉक है • आप इसे कल बदल सकते हैं",
    quickActionsTitle: "त्वरित क्रियाएं",
    bestieTitle: "बेस्टी",
    bestieDescription: "शिक्षा, तनाव और जीवन की चुनौतियों के लिए आपका AI साथी",
    counselorsTitle: "परामर्शदाताओं से जुड़ें",
    counselorsDescription: "लाइसेंस प्राप्त परामर्शदाताओं के साथ सत्र बुक करें जो छात्र जीवन को समझते हैं",
    resourceHubTitle: "संसाधन केंद्र",
    resourceHubDescription: "आपके मानसिक स्वास्थ्य यात्रा के लिए संसाधन, वीडियो और उपकरण",
    communityTitle: "समुदाय",
    communityDescription: "इसी तरह की चुनौतियों का सामना कर रहे साथियों से गुमनाम रूप से जुड़ें",
    wellnessResources: "कल्याण संसाधन",
    stressRelief: "तनाव मुक्ति",
    studyTips: "अध्ययन टिप्स",
    mindfulness: "सचेतन",
    sleepBetter: "बेहतर नींद",
    personalJournal: "व्यक्तिगत जर्नल",
    personalJournalDescription: "विचारों, आभार और दैनिक प्रतिबिंब को ट्रैक करें",
    progressTracker: "प्रगति ट्रैकर",
    progressTrackerDescription: "अपनी कल्याण और शैक्षणिक यात्रा देखें",
    progressWeek: "इस सप्ताह",
    progressImprovement: "+12% सुधार",
    lowMoodAction: {
      talkBuddy: "AI साथी से बात करें",
      getHelp: "तुरंत सहायता लें",
    },
    languageLabel: "भाषा",
  },
} as const;

export default function Dashboard() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodLocked, setMoodLocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { language, setLanguage } = useLanguage();
  const [todayProgress] = useState({
    mood: 3,
    studyHours: 4.5,
    targetHours: 6,
    completedTasks: 3,
    totalTasks: 5,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const t = translations[language];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    const firstName = user?.name.split(" ")[0] || user?.name;

    if (hour < 6)
      return {
        text: `Burning the midnight oil, ${firstName}?`,
        subtitle: "Remember to get some rest 🌙",
        icon: Moon,
      };
    if (hour < 12)
      return {
        text: `Good morning, ${firstName}!`,
        subtitle: "Ready to crush today's goals? ☀️",
        icon: Sun,
      };
    if (hour < 17)
      return {
        text: `Hey ${firstName}!`,
        subtitle: "How's your day treating you? ⚡",
        icon: Zap,
      };
    if (hour < 21)
      return {
        text: `Evening, ${firstName}!`,
        subtitle: "Time to wind down and reflect ✨",
        icon: Sparkles,
      };
    return {
      text: `Late night, ${firstName}?`,
      subtitle: "Don't forget self-care 🌙",
      icon: Moon,
    };
  };

  const greeting = getGreeting();

  const handleMoodSelect = (moodValue: number) => {
    if (!moodLocked) {
      setSelectedMood(moodValue);
      setMoodLocked(true);
      // TODO: Save to backend and trigger relevant resources
    }
  };

  const getSupportiveText = (moodValue: number) => {
    switch (moodValue) {
      case 5:
        return "You're radiating positive energy! Keep that amazing momentum going! 🌟";
      case 4:
        return "Feeling good today! You're doing great and we're here to support you! ✨";
      case 3:
        return "It's perfectly okay to have neutral days. Every small step counts! 💙";
      case 2:
        return "Feeling stressed is normal. Remember, this is temporary and you've got support! 🫂";
      case 1:
        return "Tough times are hard, but you're tougher. You're not alone in this journey! 💪";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleQuickAssessment = () => {
    navigate("/mood");
    // Scroll to Wellness Test section after navigation
    setTimeout(() => {
      const wellnessTestSection = document.querySelector(
        '[data-section="wellness-tests"]'
      );
      if (wellnessTestSection) {
        wellnessTestSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
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
                <p className="mm-text-small text-muted-foreground">
                  {greeting.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center mm-gap-2">
              <LanguageToggle />
              <ThemeToggle />
              <Link to="/crisis">
                <Button size="sm" className="crisis-support mm-btn-sm">
                  <Shield className="h-4 w-4 mr-1" />
                  Help
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Today's Progress Summary */}
      <main className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 mm-gap-3 mb-4">
          <div className="bg-secondary/10 rounded-xl p-3 text-center">
            <div className="mm-text-h3 text-secondary font-bold">
              {todayProgress.studyHours}h
            </div>
            <div className="mm-text-xs text-muted-foreground">{t.studyTime}</div>
          </div>
          <div className="bg-primary/10 rounded-xl p-3 text-center">
            <div className="mm-text-h3 text-primary font-bold">
              {todayProgress.completedTasks}/{todayProgress.totalTasks}
            </div>
            <div className="mm-text-xs text-muted-foreground">{t.tasksDone}</div>
          </div>
          <div className="bg-accent/10 rounded-xl p-3 text-center">
            <div className="mm-text-h3 text-accent font-bold">
              {selectedMood
                ? moodOptions.find((m) => m.value === selectedMood)?.emoji
                : "😐"}
            </div>
            <div className="mm-text-xs text-muted-foreground">{t.currentMood}</div>
          </div>
        </div>

        {/* Quick Mood Check */}
        <div className="bg-muted/30 rounded-xl p-4">
          <p className="mm-text-small text-foreground mb-4 flex items-center justify-center mm-gap-2 text-center">
            <Heart className="h-4 w-4 text-accent" />
            {t.moodQuestion}{" "}
            <span className="text-muted-foreground">
              {t.moodSubtitle}
            </span>
          </p>
          <div className="flex justify-center mm-gap-3 mb-4">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleMoodSelect(mood.value)}
                disabled={moodLocked && selectedMood !== mood.value}
                className={`p-3 rounded-xl transition-all transform ${
                  selectedMood === mood.value
                    ? "bg-primary/20 scale-110 shadow-lg ring-2 ring-primary/30"
                    : moodLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted/50 hover:scale-105"
                }`}
              >
                <span className="text-2xl md:text-3xl">{mood.emoji}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <div className="text-center">
              <p className="mm-text-small text-foreground font-medium">
                {getSupportiveText(selectedMood)}
              </p>
              {moodLocked && (
                <p className="mm-text-xs text-muted-foreground mt-2">
                  {t.moodLocked}
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      <main className="px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 max-w-7xl mx-auto">
        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          {quickActions.map((action) =>
            action.label === "Quick Assessment" ? (
              <Button
                key={action.label}
                variant="outline"
                className={`w-full flex-col h-14 sm:h-16 border-${action.color}/20 text-${action.color} hover:bg-${action.color}/5`}
                onClick={handleQuickAssessment}
              >
                <action.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                <span className="mm-text-xs">
                  {action.label === "Quick Assessment"
                    ? t.quickAssessment
                    : action.label === "Resources"
                    ? t.resources
                    : action.label === "Crisis Support"
                    ? t.crisisSupport
                    : t.peerChat}
                </span>
              </Button>
            ) : (
              <Link key={action.label} to={action.path}>
                <Button
                  variant="outline"
                  className={`w-full flex-col h-14 sm:h-16 border-${action.color}/20 text-${action.color} hover:bg-${action.color}/5`}
                >
                  <action.icon className="h-4 w-4 sm:h-5 sm:w-5 mb-1" />
                  <span className="mm-text-xs">
                    {action.label === "Resources"
                      ? t.resources
                      : action.label === "Crisis Support"
                      ? t.crisisSupport
                      : t.peerChat}
                  </span>
                </Button>
              </Link>
            )
          )}
        </div>

        {/* Core Features - Student-Focused */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Bestie (AI Study Buddy) */}
          <Link to="/chat">
            <Card className="mm-card p-3 sm:p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <Badge className="bg-primary text-white mm-text-xs">
                  AI Powered
                </Badge>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-1 sm:mb-2">
                {t.bestieTitle}
              </h3>
              <p className="mm-text-small text-muted-foreground">
                {t.bestieDescription}
              </p>
            </Card>
          </Link>

          {/* Connect with Counselors */}
          <Link to="/booking">
            <Card className="mm-card p-3 sm:p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-secondary/10 to-secondary/5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                  <UserCheck className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                </div>
                <div className="flex items-center mm-gap-1 mm-text-xs text-secondary">
                  <Clock className="h-3 w-3" />3 available
                </div>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-1 sm:mb-2">
                {t.counselorsTitle}
              </h3>
              <p className="mm-text-small text-muted-foreground">
                {t.counselorsDescription}
              </p>
            </Card>
          </Link>

          {/* Resource Hub */}
          <Link to="/resources">
            <Card className="mm-card p-3 sm:p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-accent/10 to-accent/5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                  <BookOpenCheck className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                </div>
                <Badge className="bg-accent text-white mm-text-xs">New!</Badge>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-1 sm:mb-2">
                {t.resourceHubTitle}
              </h3>
              <p className="mm-text-small text-muted-foreground">
                {t.resourceHubDescription}
              </p>
            </Card>
          </Link>

          {/* Community */}
          <Link to="/community">
            <Card className="mm-card p-3 sm:p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-pink-500/10 to-pink-500/5">
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-pink-500" />
                </div>
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse"></div>
              </div>
              <h3 className="mm-text-h3 text-foreground mb-1 sm:mb-2">
                {t.communityTitle}
              </h3>
              <p className="mm-text-small text-muted-foreground">
                {t.communityDescription}
              </p>
            </Card>
          </Link>
        </div>

        {/* Wellness Resources */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center mm-gap-2 mb-3 sm:mb-4">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
            <h2 className="mm-text-h2 text-foreground">{t.wellnessResources}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Link to="/mood">
              <Card className="mm-card p-2 sm:p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">
                  {t.stressRelief}
                </h4>
              </Card>
            </Link>
            <Link to="/resources">
              <Card className="mm-card p-2 sm:p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <BookMarked className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">
                  {t.studyTips}
                </h4>
              </Card>
            </Link>
            <Link to="/resources">
              <Card className="mm-card p-2 sm:p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">
                  {t.mindfulness}
                </h4>
              </Card>
            </Link>
            <Link to="/mood">
              <Card className="mm-card p-2 sm:p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                </div>
                <h4 className="mm-text-small font-medium text-foreground">
                  {t.sleepBetter}
                </h4>
              </Card>
            </Link>
          </div>
        </div>

        {/* Personal Journal & Tracking */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link to="/journal">
            <Card className="mm-card p-3 sm:p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-purple-500/10 to-purple-500/5">
              <div className="flex items-center mm-gap-2 sm:mm-gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <PenTool className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mm-text-h3 text-foreground">
                    Personal Journal
                  </h3>
                  <p className="mm-text-small text-muted-foreground">
                    {t.personalJournalDescription}
                  </p>
                </div>
                {selectedMood && (
                  <div className="text-right">
                    <div className="mm-text-xs text-muted-foreground">
                      Today's mood
                    </div>
                    <span className="text-lg sm:text-xl">
                      {moodOptions.find((m) => m.value === selectedMood)?.emoji}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </Link>

          <Link to="/progress">
            <Card className="mm-card p-3 sm:p-4 hover:scale-[1.02] transition-all cursor-pointer bg-gradient-to-br from-indigo-500/10 to-indigo-500/5">
              <div className="flex items-center mm-gap-2 sm:mm-gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-500" />
                </div>
                <div className="flex-1">
                  <h3 className="mm-text-h3 text-foreground">
                    Progress Tracker
                  </h3>
                  <p className="mm-text-small text-muted-foreground">
                    {t.progressTrackerDescription}
                  </p>
                </div>
                <div className="text-right">
                  <div className="mm-text-xs text-muted-foreground">
                    {t.progressWeek}
                  </div>
                  <div className="mm-text-small font-medium text-indigo-500">
                    {t.progressImprovement}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Motivational Message Based on Mood */}
        {selectedMood && (
          <Card className="mm-card p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-secondary/5 text-center">
            <div className="flex items-center justify-center mm-gap-2 mb-2 sm:mb-3">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
            </div>
            <p className="mm-text-body text-foreground">
              {selectedMood >= 4
                ? "You're radiating positive energy today! Keep that momentum going 🌟"
                : selectedMood === 3
                ? "It's okay to have neutral days. Small steps still count 💙"
                : selectedMood === 2
                ? "Feeling stressed? Remember, this is temporary. You've got support here 🫂"
                : "Tough times are hard, but you're tougher. You're not alone in this journey 💪"}
            </p>
            {selectedMood <= 2 && (
              <div className="flex flex-col sm:flex-row justify-center mm-gap-2 sm:mm-gap-3 mt-3 sm:mt-4">
                <Link to="/chat">
                  <Button size="sm" className="mm-btn-primary">
                    {t.lowMoodAction.talkBuddy}
                  </Button>
                </Link>
                <Link to="/crisis">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive"
                  >
                    {t.lowMoodAction.getHelp}
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
