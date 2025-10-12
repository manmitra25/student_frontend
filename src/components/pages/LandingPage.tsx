import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ThemeToggle } from "../ui/theme-toggle";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import {
  ChevronRight,
  Shield,
  Heart,
  Users,
  GraduationCap,
  MessageCircle,
  BookOpen,
  Star,
  CheckCircle,
  Phone,
  Mail,
  Globe,
  Sparkles,
  ArrowRight,
  Play,
  Award,
  Lock,
  Clock,
  Zap,
} from "lucide-react";

const colleges = [
  {
    name: "MIT Academy of Engineering",
    shortName: "MITAOE",
    students: "12,000+",
  },
  {
    name: "College of Engineering Pune",
    shortName: "COEP",
    students: "8,500+",
  },
  {
    name: "Pune Institute of Computer Technology",
    shortName: "PICT",
    students: "6,200+",
  },
  {
    name: "Symbiosis Institute of Technology",
    shortName: "SIT",
    students: "4,800+",
  },
];

const testimonials = [
  {
    id: 1,
    content:
      "ManMitra का Bestie AI मेरे लिए सबसे बड़ी मदद है। रात को 2 बजे भी मैं अपनी चिंता के बारे में बात कर सकता हूं। कोई judgment नहीं, सिर्फ support।",
    name: "Arjun K.",
    role: "Computer Engineering, MITAOE",
    year: "3rd Year",
    mood: "relieved",
    rating: 5,
  },
  {
    id: 2,
    content:
      "Family pressure और career confusion से परेशान था। यहां का community section amazing है - anonymously बात कर सकते हैं और सभी समझते हैं।",
    name: "Priya S.",
    role: "Electronics Engineering, COEP",
    year: "Final Year",
    mood: "hopeful",
    rating: 5,
  },
  {
    id: 3,
    content:
      "Counselor से session बुक करना इतना easy है। Video call पर बात करके लगा कि professional help लेना कोई बड़ी बात नहीं है।",
    name: "Rahul M.",
    role: "Mechanical Engineering, PICT",
    year: "2nd Year",
    mood: "confident",
    rating: 5,
  },
];

const features = [
  {
    icon: MessageCircle,
    title: "Bestie AI Companion",
    description:
      "24/7 available AI friend जो समझता है आपकी भावनाओं को। Hindi और English दोनों में बात करें।",
    gradient: "from-primary/20 to-secondary/20",
    iconColor: "text-primary",
    stats: "12,000+ conversations daily",
  },
  {
    icon: Users,
    title: "Anonymous Community",
    description:
      "Safe space में अपने जैसे students से जुड़ें। Share करें, support करें, बिना किसी डर के।",
    gradient: "from-secondary/20 to-accent/20",
    iconColor: "text-secondary",
    stats: "3,500+ active members",
  },
  {
    icon: Shield,
    title: "Licensed Counselors",
    description:
      "Qualified mental health professionals से video/audio sessions। Cultural context समझने वाले experts।",
    gradient: "from-accent/20 to-destructive/20",
    iconColor: "text-accent",
    stats: "150+ verified counselors",
  },
  {
    icon: BookOpen,
    title: "Wellness Resources",
    description:
      "Stress management से लेकर career guidance तक। Interactive tools और practical strategies।",
    gradient: "from-violet-500/20 to-pink-500/20",
    iconColor: "text-violet-500",
    stats: "500+ resources available",
  },
];

const stats = [
  { number: "15,000+", label: "Students Supported", icon: Users },
  { number: "98%", label: "Feel Better", icon: Heart },
  { number: "24/7", label: "Always Available", icon: Clock },
  { number: "100%", label: "Private & Secure", icon: Lock },
];

const containerClass = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

export default function LandingPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background transition-colors duration-300">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div
          className={`${containerClass} flex flex-wrap items-center justify-between gap-3 py-3 sm:py-4`}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 sm:h-12 sm:w-12">
              <Heart className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight text-foreground sm:text-2xl md:text-3xl">
                ManMitra
              </h1>
              <p className="hidden text-xs text-muted-foreground sm:block">
                मानसिक स्वास्थ्य सहयोग
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
            <ThemeToggle />
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="px-3 text-sm font-medium text-foreground transition-colors duration-200 hover:text-primary sm:px-4"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="btn-primary flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={`relative py-20 px-4 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <div className="space-y-12">
            <div className="space-y-8">
              <div className="flex justify-center">
                <Badge
                  className="flex items-center justify-center 
               bg-gradient-to-r from-primary/10 to-secondary/10 
               text-primary border border-primary/20 
               px-3 sm:px-4 md:px-6 lg:px-8 
               py-2 sm:py-2.5 md:py-3 lg:py-4 
               text-xs sm:text-sm md:text-base lg:text-lg 
               rounded-full text-center whitespace-normal text-wrap"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 mr-1 sm:mr-2" />
                  <span>
                    India's First Culturally-Aware Mental Health Platform
                  </span>
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground leading-snug sm:leading-tight text-center px-4">
                Your Mental Health,
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {" "}
                  Your Safe Space
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl sm:max-w-3xl mx-auto mt-4 leading-relaxed text-center px-4">
                ManMitra आपका विश्वसनीय साथी है। चाहे आप stress, anxiety, या
                career confusion से जूझ रहे हों — हम यहाँ हैं आपके लिए।
              </p>

              <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
                <span className="font-semibold">Completely anonymous</span> और{" "}
                <span className="font-semibold">
                  culturally sensitive support
                </span>{" "}
                for students like you ✨
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/login">
                <Button
                  size="lg"
                  className="btn-primary px-12 py-6 text-lg hover:scale-105 transition-transform text-white"
                >
                  Start Your Journey
                  <Heart className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-12 py-6 text-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-border/30 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-secondary" />
                <span className="font-medium">100% Free for Students</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-medium">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Award className="w-5 h-5 text-accent" />
                <span className="font-medium">Licensed Professionals</span>
              </div>
            </div>

            {/* Floating Elements for Visual Interest */}
            <div className="relative">
              <div className="absolute -top-20 left-1/4 w-16 h-16 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full animate-float blur-sm"></div>
              <div
                className="absolute -top-10 right-1/3 w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full animate-float blur-sm"
                style={{ animationDelay: "1s" }}
              ></div>
              <div
                className="absolute top-5 left-1/2 w-8 h-8 bg-gradient-to-br from-accent/20 to-destructive/20 rounded-full animate-float blur-sm"
                style={{ animationDelay: "2s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20 px-4 py-2 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Complete Mental Health Ecosystem
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Everything You Need for{" "}
              <span className="text-primary">Mental Wellness</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Specially designed for Indian students, understanding cultural
              contexts, family pressures, and academic stress. हमारा approach
              completely holistic है।
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${feature.gradient} hover:scale-105 group`}
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-accent" />
                      <span className="text-sm font-medium text-accent">
                        {feature.stats}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-muted/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Students Love ManMitra 💙
            </h2>
            <p className="text-lg text-muted-foreground">
              Real stories from students across India's top engineering colleges
            </p>
          </div>

          <Card className="p-8 md:p-12 border-0 shadow-2xl bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent"></div>

            <div className="text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-accent fill-current"
                      />
                    )
                  )}
                </div>

                <blockquote className="text-xl md:text-2xl text-foreground mb-6 italic leading-relaxed font-medium">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>

                <div className="space-y-2">
                  <div className="font-semibold text-foreground text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentTestimonial].role} •{" "}
                    {testimonials[currentTestimonial].year}
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? "bg-primary scale-125"
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Colleges Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            Trusted by students from top engineering colleges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {colleges.map((college, index) => (
              <div key={index} className="group">
                <Card className="p-6 border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <GraduationCap className="w-8 h-8 text-primary group-hover:text-secondary transition-colors" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground text-sm">
                        {college.shortName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {college.students} students
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-left">
                    {college.name}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/5 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to start your mental wellness journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who have found support, healing, and
                growth through ManMitra.
                <span className="font-semibold text-foreground">
                  {" "}
                  Your mental health matters, और आपका पहला कदम incredible
                  strength दिखाता है।
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="btn-primary px-8 py-4 text-lg hover:scale-105 transition-transform"
                  >
                    Start Today - It's Free
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/crisis">
                  <Button
                    size="lg"
                    className="crisis-support px-8 py-4 text-lg hover:scale-105 transition-transform"
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Need Help Right Now?
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    ManMitra
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    मानसिक स्वास्थ्य सहयोग
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                India's first culturally-aware mental health platform for
                students. Supporting young minds with compassion, understanding,
                and professional care.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-primary"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  support@manmitra.com
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <div className="space-y-2">
                <Link
                  to="/crisis"
                  className="block text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Crisis Support
                </Link>
                <Link
                  to="/resources"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Mental Health Resources
                </Link>
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Data Protection
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 ManMitra. Made with ❤️ for Indian students. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
