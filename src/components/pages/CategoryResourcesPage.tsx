import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  ArrowLeft, 
  Heart,
  Lightbulb,
  BookOpen,
  Sun,
  Users,
  TrendingUp,
  Play,
  Clock,
  Star,
  Download,
  ExternalLink,
  X 
} from 'lucide-react';
import Navigation from '../shared/Navigation';

// 1. IMPORT THE CUSTOM COVER IMAGE 
// Assuming this component is in 'New folder\studentFixedFrontend\src\pages\' or similar,
// and the image is in 'New folder\studentFixedFrontend\src\public\'.
// We use a relative path to the public folder, or a direct import if the setup supports it.
// For simplicity and correctness across bundlers, we'll try a direct relative import first.

// NOTE: The exact path might vary based on your project's webpack/vite config. 
// A common relative import is used here. You might need to adjust it based on 
// where CategoryResourcesPage.tsx lives relative to the public folder.
// Since you indicated the public folder is inside 'src', we'll rely on the simple
// '/mindful_moment_cover.png' path which usually works for assets placed 
// directly in the `public` directory (accessible from the web root `/`).
const MIND_MOMENT_COVER = '/mindful_moment_cover.png'; 
const Muscle_Relaxation_COVER = '/muscle_relaxation_cover.png';
const Breathing_Exercises_for_Anxiety_COVER = '/breathing_exercises_for_anxiety_cover.png';
const Mindfulness_for_Stress_Relief_COVER = '/mindfulness_for_stress_relief_cover.png';

// Category data mapping
const categoryData = {
  'anxiety-stress': {
    title: 'Anxiety & Stress',
    icon: Heart,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    resources: [
      {
        id: 1,
        title: '5-4-3-2-1 Grounding Technique',
        description: 'A simple technique to help you ground yourself when feeling anxious by focusing on your senses.',
        duration: '5 min',
        type: 'Video',
        difficulty: 'Easy',
        rating: 4.8,
        icon: Play,
        youtubeUrl: 'https://www.youtube.com/watch?v=pjRMg6KALiw',
        videoId: 'pjRMg6KALiw',
        // 2. USE THE IMPORTED PATH OR THE PUBLIC ROOT PATH
        coverImage: MIND_MOMENT_COVER 
      },
      {
        id: 2,
        title: 'Progressive Muscle Relaxation',
        description: 'Learn to systematically tense and relax different muscle groups to reduce physical tension.',
        duration: '15 min',
        type: 'Guided Practice',
        difficulty: 'Medium',
        rating: 4.6,
        icon: Heart,
        youtubeUrl: 'https://www.youtube.com/watch?v=IZub-H2G4d4',
        videoId: 'IZub-H2G4d4',
        // 2. USE THE IMPORTED PATH OR THE PUBLIC ROOT PATH
        coverImage: Muscle_Relaxation_COVER
      },
      {
        id: 3,
        title: 'Breathing Exercises for Anxiety',
        description: 'Master various breathing techniques to calm your nervous system and reduce anxiety symptoms.',
        duration: '10 min',
        type: 'Breathing',
        difficulty: 'Easy',
        rating: 4.9,
        icon: Heart,
        youtubeUrl: 'https://www.youtube.com/watch?v=eZBa63NZbbE',
        videoId: 'eZBa63NZbbE',
        // 2. USE THE IMPORTED PATH OR THE PUBLIC ROOT PATH
        coverImage: Breathing_Exercises_for_Anxiety_COVER
      },
      {
        id: 4,
        title: 'Mindfulness for Stress Relief',
        description: 'Practice mindfulness meditation specifically designed to help manage daily stress and anxiety.',
        duration: '20 min',
        type: 'Meditation',
        difficulty: 'Medium',
        rating: 4.7,
        icon: Heart,
        youtubeUrl: 'https://www.youtube.com/watch?v=wE292vsJcBY',
        videoId: 'wE292vsJcBY',
        // 2. USE THE IMPORTED PATH OR THE PUBLIC ROOT PATH
        coverImage: Mindfulness_for_Stress_Relief_COVER
      }
    ]
  },
  'depression-support': {
    title: 'Depression Support',
    icon: Lightbulb,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    resources: [
      {
        id: 1,
        title: 'Daily Mood Tracking',
        description: 'Track your mood patterns and identify triggers to better understand your emotional cycles.',
        duration: '5 min',
        type: 'Tracking',
        difficulty: 'Easy',
        rating: 4.5,
        icon: Lightbulb
      },
      {
        id: 2,
        title: 'Cognitive Behavioral Techniques',
        description: 'Learn CBT strategies to challenge negative thought patterns and build healthier thinking habits.',
        duration: '30 min',
        type: 'Therapy',
        difficulty: 'Medium',
        rating: 4.8,
        icon: Lightbulb
      },
      {
        id: 3,
        title: 'Building a Support Network',
        description: 'Guidance on how to build and maintain meaningful relationships during difficult times.',
        duration: '15 min',
        type: 'Guide',
        difficulty: 'Easy',
        rating: 4.4,
        icon: Lightbulb
      },
      {
        id: 4,
        title: 'Self-Compassion Practices',
        description: 'Develop self-compassion through guided exercises and daily practices for emotional healing.',
        duration: '25 min',
        type: 'Practice',
        difficulty: 'Medium',
        rating: 4.6,
        icon: Lightbulb
      }
    ]
  },
  'study-focus': {
    title: 'Study & Focus',
    icon: BookOpen,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    resources: [
      {
        id: 1,
        title: 'Pomodoro Study Method',
        description: 'Master the 25-minute focused study sessions with strategic breaks to maximize productivity.',
        duration: '25 min',
        type: 'Technique',
        difficulty: 'Easy',
        rating: 4.9,
        icon: BookOpen
      },
      {
        id: 2,
        title: 'Active Recall Strategies',
        description: 'Learn evidence-based techniques to improve memory retention and test performance.',
        duration: '20 min',
        type: 'Study Method',
        difficulty: 'Medium',
        rating: 4.7,
        icon: BookOpen
      },
      {
        id: 3,
        title: 'Note-Taking Mastery',
        description: 'Discover effective note-taking systems like Cornell and mind mapping for better learning.',
        duration: '15 min',
        type: 'Skill',
        difficulty: 'Easy',
        rating: 4.6,
        icon: BookOpen
      },
      {
        id: 4,
        title: 'Exam Preparation Guide',
        description: 'Comprehensive strategies for exam preparation, from planning to execution and stress management.',
        duration: '45 min',
        type: 'Guide',
        difficulty: 'Medium',
        rating: 4.8,
        icon: BookOpen
      }
    ]
  },
  'sleep-wellness': {
    title: 'Sleep & Wellness',
    icon: Sun,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    resources: [
      {
        id: 1,
        title: 'Sleep Hygiene Checklist',
        description: 'Essential habits and routines to improve your sleep quality and establish healthy patterns.',
        duration: '10 min',
        type: 'Checklist',
        difficulty: 'Easy',
        rating: 4.7,
        icon: Sun
      },
      {
        id: 2,
        title: 'Relaxation Before Bed',
        description: 'Guided relaxation techniques to help you wind down and prepare for restful sleep.',
        duration: '20 min',
        type: 'Relaxation',
        difficulty: 'Easy',
        rating: 4.5,
        icon: Sun
      },
      {
        id: 3,
        title: 'Morning Energy Routine',
        description: 'Start your day with energy-boosting activities that set a positive tone for the day.',
        duration: '15 min',
        type: 'Routine',
        difficulty: 'Easy',
        rating: 4.6,
        icon: Sun
      },
      {
        id: 4,
        title: 'Digital Detox Guide',
        description: 'Learn how to manage screen time and create healthy boundaries with technology.',
        duration: '30 min',
        type: 'Guide',
        difficulty: 'Medium',
        rating: 4.4,
        icon: Sun
      }
    ]
  },
  'relationships': {
    title: 'Relationships',
    icon: Users,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50',
    resources: [
      {
        id: 1,
        title: 'Communication Skills',
        description: 'Learn effective communication techniques for building stronger relationships.',
        duration: '25 min',
        type: 'Skill',
        difficulty: 'Medium',
        rating: 4.8,
        icon: Users
      },
      {
        id: 2,
        title: 'Setting Healthy Boundaries',
        description: 'Understand how to set and maintain healthy boundaries in all your relationships.',
        duration: '20 min',
        type: 'Guide',
        difficulty: 'Medium',
        rating: 4.6,
        icon: Users
      },
      {
        id: 3,
        title: 'Conflict Resolution',
        description: 'Master strategies for resolving conflicts constructively and maintaining relationships.',
        duration: '30 min',
        type: 'Skill',
        difficulty: 'Hard',
        rating: 4.7,
        icon: Users
      },
      {
        id: 4,
        title: 'Building Self-Esteem',
        description: 'Develop confidence and self-worth to improve all aspects of your relationships.',
        duration: '35 min',
        type: 'Practice',
        difficulty: 'Medium',
        rating: 4.5,
        icon: Users
      }
    ]
  },
  'career-future': {
    title: 'Career & Future',
    icon: TrendingUp,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    resources: [
      {
        id: 1,
        title: 'Career Assessment Tools',
        description: 'Discover your strengths, interests, and values to guide your career decisions.',
        duration: '40 min',
        type: 'Assessment',
        difficulty: 'Easy',
        rating: 4.6,
        icon: TrendingUp
      },
      {
        id: 2,
        title: 'Resume Building Workshop',
        description: 'Create a compelling resume that showcases your skills and experiences effectively.',
        duration: '60 min',
        type: 'Workshop',
        difficulty: 'Medium',
        rating: 4.8,
        icon: TrendingUp
      },
      {
        id: 3,
        title: 'Interview Preparation',
        description: 'Master interview techniques and practice common questions to boost your confidence.',
        duration: '45 min',
        type: 'Practice',
        difficulty: 'Medium',
        rating: 4.7,
        icon: TrendingUp
      },
      {
        id: 4,
        title: 'Goal Setting Framework',
        description: 'Learn SMART goal-setting techniques to plan and achieve your career objectives.',
        duration: '25 min',
        type: 'Framework',
        difficulty: 'Easy',
        rating: 4.5,
        icon: TrendingUp
      }
    ]
  }
};

export default function CategoryResourcesPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  
  const category = categoryData[categoryId as keyof typeof categoryData] || categoryData['anxiety-stress'];
  const resources = category.resources as (typeof categoryData['anxiety-stress']['resources'][0] & { videoId?: string; coverImage?: string; });

  const startVideo = (videoId: string) => {
    setActiveVideoId(videoId);
  };

  const closeVideo = () => {
    setActiveVideoId(null);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mm-gap-3">
            <Link to="/study-tools">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="mm-text-h2 text-foreground">{category.title}</h1>
              <p className="mm-text-small text-muted-foreground">
                {resources.length} resources to help you on your journey
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Category Info Card */}
        <Card className="mm-card mm-p-6 mb-6 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="flex items-center mm-gap-3 mb-4">
            <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
              <category.icon className={`h-6 w-6 ${category.color}`} />
            </div>
            <div>
              <h2 className="mm-text-h2 text-foreground">{category.title}</h2>
              <p className="mm-text-small text-muted-foreground">
                Explore these carefully curated resources
              </p>
            </div>
          </div>
        </Card>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const isVideoResource = resource.videoId;

            if (isVideoResource) {
              return (
                <Card 
                  key={resource.id} 
                  className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer group flex flex-col justify-between"
                  onClick={() => startVideo(resource.videoId!)}
                >
                  <div className="text-center">
                    {/* CUSTOM COVER IMAGE DISPLAY */}
                    <div className={`w-full h-32 mb-3 ${category.bgColor} rounded-lg flex items-center justify-center relative overflow-hidden`}>
                      <img
                          // 3. USE THE 'coverImage' PROPERTY FOR THE SOURCE
                          src={resource.coverImage || `/placeholder.png`} // Fallback to a generic placeholder if needed
                          alt={`${resource.title} cover`}
                          className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                      {/* Play Button Overlay (always visible on hover) */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <Play className="h-10 w-10 text-white fill-current" />
                      </div>
                    </div>

                    <h3 className="mm-text-h3 text-foreground font-semibold line-clamp-2">
                      {resource.title}
                    </h3>
                    <Badge className="bg-primary text-white mm-text-xs mt-2">
                      <Play className="h-3 w-3 mr-1" />
                      Watch Video
                    </Badge>
                  </div>
                </Card>
              );
            }
            
            // ORIGINAL CARD CONTENT for non-video resources
            return (
              <Card 
                key={resource.id} 
                className="mm-card mm-p-4 hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div className="flex items-start mm-gap-3 mb-3">
                  <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <resource.icon className={`h-5 w-5 ${category.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="mm-text-h3 text-foreground group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="mm-text-small text-muted-foreground mt-1 line-clamp-2">
                      {resource.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mm-gap-2 mb-3">
                  <Badge variant="secondary" className="mm-text-xs">
                    {resource.type}
                  </Badge>
                  <Badge variant="outline" className="mm-text-xs">
                    {resource.difficulty}
                  </Badge>
                  <div className="flex items-center mm-gap-1 ml-auto">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="mm-text-xs text-muted-foreground">{resource.rating}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center mm-gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="mm-text-xs">{resource.duration}</span>
                  </div>
                  <div className="flex mm-gap-2">
                    <Button size="sm" variant="outline" className="mm-text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" className="mm-btn-primary mm-text-xs">
                      <Play className="h-3 w-3 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Back to Study Tools */}
        <div className="mt-8 text-center">
          <Link to="/study-tools">
            <Button variant="outline" className="mm-gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Study Tools
            </Button>
          </Link>
        </div>
      </main>

      {/* YOUTUBE VIDEO PLAYER MODAL/OVERLAY */}
      {activeVideoId && (
          <div 
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4" 
              onClick={closeVideo} 
          >
              <div 
                  className="w-full max-w-2xl bg-card rounded-lg overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()} 
              >
                  {/* Close Button */}
                  <div className="p-2 flex justify-end">
                      <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={closeVideo}
                          className="text-white hover:bg-muted"
                      >
                          <X className="h-6 w-6" />
                      </Button>
                  </div>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%', marginTop: '-3rem' }}> 
                      <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1`}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title="Embedded YouTube Video"
                      ></iframe>
                  </div>
              </div>
          </div>
      )}

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  );
}