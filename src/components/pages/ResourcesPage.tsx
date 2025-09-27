import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  BookOpen, 
  Search, 
  ArrowLeft, 
  Clock, 
  Star,
  Play,
  Download,
  Heart,
  Brain,
  Moon,
  Users as UsersIcon,
  Flower,
  Shield,
  Headphones,
  FileText,
  Video,
  Bookmark,
  BookmarkCheck,
  Filter,
  X
} from 'lucide-react';
import Navigation from '../shared/Navigation';
import EmptyState from '../shared/EmptyState';

const categories = [
  { 
    id: 'stress-management', 
    name: 'Stress & Anxiety', 
    icon: Brain, 
    color: 'primary',
    description: 'Breathing techniques, exam stress relief, and academic pressure management',
    count: 15
  },
  { 
    id: 'sleep-wellness', 
    name: 'Sleep & Rest', 
    icon: Moon, 
    color: 'violet-500',
    description: 'Better sleep habits, relaxation methods, and energy management',
    count: 12
  },
  { 
    id: 'relationships', 
    name: 'Relationships', 
    icon: Heart, 
    color: 'accent',
    description: 'Family dynamics, friendships, and healthy communication',
    count: 18
  },
  { 
    id: 'identity-growth', 
    name: 'Self-Discovery', 
    icon: Flower, 
    color: 'secondary',
    description: 'Building confidence, cultural identity, and personal growth',
    count: 14
  },
  { 
    id: 'crisis-resources', 
    name: 'Crisis Support', 
    icon: Shield, 
    color: 'destructive',
    description: 'Emergency resources, safety planning, and immediate help',
    count: 8
  }
];

// Video URL mapping for resources
const videoUrlMap: { [key: string]: string } = {
  '5-Minute Calm Before Exams': 'https://www.youtube.com/watch?v=wE292vsJcBY&t=150s',
  'Breaking the Worry Cycle': 'https://www.youtube.com/watch?v=s_Ikc1zHrCE',
  'Pressure Cooker to Peace: Managing Family Expectations': 'https://www.youtube.com/shorts/40kNhFMTN6g',
  'Student Sleep Rescue Plan': 'https://www.youtube.com/watch?v=2jr6aisK3NE',
  'Deep Sleep Meditation': 'https://www.youtube.com/watch?v=lu_cLaBTXio',
  'Talking to Parents About Mental Health': 'https://www.youtube.com/watch?v=QTy3WQgbt9E',
  'Friendship Boundaries in College': 'https://www.youtube.com/watch?v=Gf4FIt5DG4g',
  'Finding Your Voice in Engineering Culture': 'https://www.youtube.com/watch?v=Gf4FIt5DG4g', // Same as Friendship Boundaries
  'Self-Compassion for Perfectionists': 'https://www.youtube.com/watch?v=Gf4FIt5DG4g', // Same as Friendship Boundaries
  'Crisis Safety Planning Workbook': 'https://www.youtube.com/watch?v=Gf4FIt5DG4g' // Same as Friendship Boundaries
};

const allResources = [
  // Stress & Anxiety Resources
  {
    id: 1,
    title: '5-Minute Calm Before Exams',
    description: 'Quick breathing exercise to center yourself before any exam or presentation. Perfect for last-minute anxiety relief.',
    type: 'audio',
    duration: '5 min',
    difficulty: 'Beginner',
    category: 'stress-management',
    rating: 4.9,
    saves: 1247,
    isNew: true,
    language: 'Hindi/English'
  },
  {
    id: 2,
    title: 'Breaking the Worry Cycle',
    description: 'Evidence-based techniques to stop overthinking and manage academic anxiety effectively.',
    type: 'article',
    duration: '7 min read',
    difficulty: 'Intermediate',
    category: 'stress-management',
    rating: 4.8,
    saves: 892,
    isNew: false,
    language: 'English'
  },
  {
    id: 3,
    title: 'Pressure Cooker to Peace: Managing Family Expectations',
    description: 'Navigate cultural expectations while protecting your mental health. Practical strategies for Indian students.',
    type: 'video',
    duration: '12 min',
    difficulty: 'Intermediate',
    category: 'stress-management',
    rating: 4.9,
    saves: 2156,
    isNew: true,
    language: 'Hindi'
  },

  // Sleep & Rest Resources
  {
    id: 4,
    title: 'Student Sleep Rescue Plan',
    description: 'Transform your sleep schedule even with unpredictable college routines. Science-backed sleep hygiene tips.',
    type: 'article',
    duration: '8 min read',
    difficulty: 'Beginner',
    category: 'sleep-wellness',
    rating: 4.7,
    saves: 1543,
    isNew: false,
    language: 'English'
  },
  {
    id: 5,
    title: 'Deep Sleep Meditation',
    description: 'Gentle guided meditation to help you fall asleep faster and sleep more deeply.',
    type: 'audio',
    duration: '20 min',
    difficulty: 'Beginner',
    category: 'sleep-wellness',
    rating: 4.8,
    saves: 987,
    isNew: false,
    language: 'Hindi/English'
  },

  // Relationships Resources
  {
    id: 6,
    title: 'Talking to Parents About Mental Health',
    description: 'How to have honest conversations with traditional parents about therapy and mental wellness.',
    type: 'video',
    duration: '15 min',
    difficulty: 'Intermediate',
    category: 'relationships',
    rating: 4.9,
    saves: 3201,
    isNew: true,
    language: 'Hindi'
  },
  {
    id: 7,
    title: 'Friendship Boundaries in College',
    description: 'Build healthy friendships and navigate social pressures without losing yourself.',
    type: 'article',
    duration: '6 min read',
    difficulty: 'Beginner',
    category: 'relationships',
    rating: 4.6,
    saves: 756,
    isNew: false,
    language: 'English'
  },

  // Self-Discovery Resources
  {
    id: 8,
    title: 'Finding Your Voice in Engineering Culture',
    description: 'Build confidence in male-dominated fields while staying true to your values.',
    type: 'video',
    duration: '18 min',
    difficulty: 'Intermediate',
    category: 'identity-growth',
    rating: 4.8,
    saves: 1432,
    isNew: false,
    language: 'English'
  },
  {
    id: 9,
    title: 'Self-Compassion for Perfectionists',
    description: 'Learn to be kind to yourself when you make mistakes or fall short of high expectations.',
    type: 'audio',
    duration: '12 min',
    difficulty: 'Beginner',
    category: 'identity-growth',
    rating: 4.7,
    saves: 1876,
    isNew: true,
    language: 'Hindi/English'
  },

  // Crisis Resources
  {
    id: 10,
    title: 'Crisis Safety Planning Workbook',
    description: 'Step-by-step guide to create your personal safety plan for mental health emergencies.',
    type: 'article',
    duration: '15 min read',
    difficulty: 'Important',
    category: 'crisis-resources',
    rating: 4.9,
    saves: 892,
    isNew: false,
    language: 'Hindi/English'
  }
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedResources, setSavedResources] = useState<Set<number>>(new Set([1, 3, 6]));
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedResourceTitle, setSelectedResourceTitle] = useState('');

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    const videoId = url.includes('youtube.com/watch?v=') 
      ? url.split('v=')[1]?.split('&')[0]
      : url.includes('youtube.com/shorts/')
      ? url.split('shorts/')[1]?.split('?')[0]
      : null;
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Handle opening modal with video
  const handleStartResource = (resourceTitle: string) => {
    const videoUrl = videoUrlMap[resourceTitle];
    if (videoUrl) {
      setSelectedVideoUrl(videoUrl);
      setSelectedResourceTitle(resourceTitle);
      setIsModalOpen(true);
    }
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideoUrl('');
    setSelectedResourceTitle('');
  };

  // Body scroll lock effect
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || resource.category === selectedCategory;
    const matchesSaved = !showSavedOnly || savedResources.has(resource.id);
    return matchesSearch && matchesCategory && matchesSaved;
  });

  const toggleSave = (resourceId: number) => {
    setSavedResources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Headphones;
      case 'article': return FileText;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-gradient-to-br from-accent to-accent/80';
      case 'audio': return 'bg-gradient-to-br from-secondary to-secondary/80';
      case 'article': return 'bg-gradient-to-br from-primary to-primary/80';
      default: return 'bg-gradient-to-br from-primary to-primary/80';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'Intermediate': return 'bg-accent/10 text-accent border-accent/20';
      case 'Important': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const featuredResources = allResources.filter(r => r.isNew).slice(0, 3);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center mm-gap-3 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:scale-110 transition-transform">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="mm-text-h1 text-foreground">Wellness Resources</h1>
              <p className="mm-text-small text-muted-foreground">
                Practical tools for your mental health journey
              </p>
            </div>
            <Button
              variant={showSavedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={showSavedOnly ? "mm-btn-primary mm-btn-sm" : "mm-btn-secondary mm-btn-sm"}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Saved
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for stress relief, sleep tips, relationship advice..."
              className="mm-input pl-10"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 mm-gap-4 mb-8">
          <Card className="mm-card mm-p-3 text-center">
            <div className="mm-text-h2 text-primary font-bold">{allResources.length}</div>
            <div className="mm-text-small text-muted-foreground">Total Resources</div>
          </Card>
          <Card className="mm-card mm-p-3 text-center">
            <div className="mm-text-h2 text-secondary font-bold">{savedResources.size}</div>
            <div className="mm-text-small text-muted-foreground">Saved by You</div>
          </Card>
          <Card className="mm-card mm-p-3 text-center">
            <div className="mm-text-h2 text-accent font-bold">{allResources.filter(r => r.isNew).length}</div>
            <div className="mm-text-small text-muted-foreground">New This Week</div>
          </Card>
        </div>

        {/* Featured This Week */}
        {!selectedCategory && !showSavedOnly && (
          <section className="mb-8">
            <div className="flex items-center mm-gap-2 mb-6">
              <h2 className="mm-text-h2 text-foreground">✨ New This Week</h2>
              <Badge className="bg-accent text-white">Fresh Content</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 mm-gap-4">
              {featuredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <Card key={resource.id} className="mm-card mm-p-3 group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-3xl"></div>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${getTypeColor(resource.type)} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                        <TypeIcon className="h-6 w-6 text-white" />
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave(resource.id);
                        }}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        {savedResources.has(resource.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>

                    <h3 className="mm-text-h3 text-foreground mb-2">{resource.title}</h3>
                    <p className="mm-text-small text-muted-foreground mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    <div className="flex items-center justify-between mm-text-small">
                      <div className="flex items-center mm-gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center mm-gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-muted-foreground">{resource.rating}</span>
                        </div>
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Categories */}
        {!showSavedOnly && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="mm-text-h2 text-foreground">Browse by Topic</h2>
              {selectedCategory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="mm-btn-secondary mm-btn-sm"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Clear Filter
                </Button>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mm-gap-4">
              {categories.map((category) => {
                const IconComponent = category.icon;
                const isSelected = selectedCategory === category.id;
                
                return (
                  <Card 
                    key={category.id} 
                    className={`mm-card mm-p-3 cursor-pointer hover:scale-[1.02] transition-all ${
                      isSelected 
                        ? `border-primary bg-primary/5 shadow-lg shadow-primary/10` 
                        : ''
                    }`}
                    onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 bg-${category.color}/10 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className={`h-6 w-6 text-${category.color}`} />
                      </div>
                      <h3 className="mm-text-h3 text-foreground mb-2">{category.name}</h3>
                      <p className="mm-text-xs text-muted-foreground mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <Badge variant="outline" className="mm-text-xs">
                        {category.count} resources
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Resource List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="mm-text-h2 text-foreground">
              {showSavedOnly ? 'Your Saved Resources' :
               selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name || 'Resources'
                : 'All Resources'
              }
            </h2>
            <p className="mm-text-small text-muted-foreground">
              {filteredResources.length} resources
            </p>
          </div>

          {filteredResources.length === 0 ? (
            <EmptyState
              icon={showSavedOnly ? Bookmark : BookOpen}
              title={showSavedOnly ? "No saved resources yet" : "No resources found"}
              description={showSavedOnly 
                ? "Start saving resources you find helpful by clicking the bookmark icon."
                : "Try adjusting your search or browse different categories."
              }
              actionLabel={showSavedOnly ? "Browse Resources" : "Clear Filters"}
              onAction={() => {
                if (showSavedOnly) {
                  setShowSavedOnly(false);
                } else {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                const isSaved = savedResources.has(resource.id);
                
                return (
                  <Card key={resource.id} className="mm-card mm-p-3 hover:scale-[1.005] transition-all group">
                    <div className="flex items-start mm-gap-4">
                      <div className={`w-16 h-16 ${getTypeColor(resource.type)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                        <TypeIcon className="h-8 w-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 mr-4">
                            <div className="flex items-center mm-gap-2 mb-1">
                              <h3 className="mm-text-h3 text-foreground">{resource.title}</h3>
                              {resource.isNew && (
                                <Badge className="bg-accent text-white mm-text-xs">New</Badge>
                              )}
                            </div>
                            <p className="mm-text-small text-muted-foreground mb-3 leading-relaxed">
                              {resource.description}
                            </p>
                            <div className="flex items-center mm-gap-2 mm-text-xs text-muted-foreground">
                              <span>Available in {resource.language}</span>
                              <span>•</span>
                              <span>{resource.saves} saves</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center mm-gap-2">
                            <div className="flex items-center gap-1 mm-text-small">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-muted-foreground">{resource.rating}</span>
                            </div>
                            <button
                              onClick={() => toggleSave(resource.id)}
                              className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                              {isSaved ? (
                                <BookmarkCheck className="h-5 w-5 text-primary" />
                              ) : (
                                <Bookmark className="h-5 w-5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center mm-gap-3 mm-text-small text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {resource.duration}
                            </div>
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </Badge>
                          </div>
                          
                          <Button 
                            size="sm" 
                            className="mm-btn-primary mm-btn-sm group-hover:scale-105 transition-transform"
                            onClick={() => handleStartResource(resource.title)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Help Section */}
        <Card className="mt-8 mm-card mm-p-4 bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
          <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="mm-text-h2 text-foreground mb-2">Need Personal Guidance?</h3>
          <p className="mm-text-body text-muted-foreground mb-6">
            These resources are great, but sometimes you need someone to talk to. Our counselors are here for you.
          </p>
          <div className="flex flex-col sm:flex-row mm-gap-3 justify-center">
            <Link to="/booking">
              <Button className="mm-btn-primary">
                <Shield className="h-4 w-4 mr-2" />
                Book a Session
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Heart className="h-4 w-4 mr-2" />
                Chat with Bestie AI
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Navigation />
      </div>

      {/* Video Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-4xl mx-4 bg-card rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="mm-text-h3 text-foreground">{selectedResourceTitle}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseModal}
                className="hover:bg-muted rounded-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Video Container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={getEmbedUrl(selectedVideoUrl)}
                title={selectedResourceTitle}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-muted/20">
              <div className="flex items-center justify-between">
                <p className="mm-text-small text-muted-foreground">
                  Click outside the modal or press the X button to close
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                  className="mm-btn-secondary mm-btn-sm"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}