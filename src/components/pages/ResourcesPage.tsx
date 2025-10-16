import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import LanguageToggle from '../shared/LanguageToggle';
import { useLanguage, Language } from '../shared/LanguageProvider';

const categories = [
  { 
    id: 'stress-management', 
    name: { en: 'Stress & Anxiety', hi: 'तनाव और चिंता' }, 
    icon: Brain, 
    color: 'primary',
    description: {
      en: 'Breathing techniques, exam stress relief, and academic pressure management',
      hi: 'श्वास तकनीक, परीक्षा तनाव राहत और शैक्षणिक दबाव प्रबंधन',
    },
    count: 15
  },
  { 
    id: 'sleep-wellness', 
    name: { en: 'Sleep & Rest', hi: 'नींद और विश्राम' }, 
    icon: Moon, 
    color: 'violet-500',
    description: {
      en: 'Better sleep habits, relaxation methods, and energy management',
      hi: 'बेहतर नींद की आदतें, विश्राम विधियाँ और ऊर्जा प्रबंधन',
    },
    count: 12
  },
  { 
    id: 'relationships', 
    name: { en: 'Relationships', hi: 'रिश्ते' }, 
    icon: Heart, 
    color: 'accent',
    description: {
      en: 'Family dynamics, friendships, and healthy communication',
      hi: 'पारिवारिक संबंध, दोस्ती और स्वस्थ संवाद',
    },
    count: 18
  },
  { 
    id: 'identity-growth', 
    name: { en: 'Self-Discovery', hi: 'स्वयं की खोज' }, 
    icon: Flower, 
    color: 'secondary',
    description: {
      en: 'Building confidence, cultural identity, and personal growth',
      hi: 'आत्मविश्वास, सांस्कृतिक पहचान और व्यक्तिगत विकास',
    },
    count: 14
  },
  { 
    id: 'crisis-resources', 
    name: { en: 'Crisis Support', hi: 'आपातकालीन सहायता' }, 
    icon: Shield, 
    color: 'destructive',
    description: {
      en: 'Emergency resources, safety planning, and immediate help',
      hi: 'आपातकालीन संसाधन, सुरक्षा योजना और त्वरित सहायता',
    },
    count: 8
  }
];

const translations = {
  en: {
    title: 'Wellness Resources',
    subtitle: 'Practical tools for your mental health journey',
    saved: 'Saved',
    searchPlaceholder: 'Search for stress relief, sleep tips, relationship advice...',
    totalResources: 'Total Resources',
    savedByYou: 'Saved by You',
    newThisWeek: 'New This Week',
    featuredTitle: '✨ New This Week',
    featuredBadge: 'Fresh Content',
    browseByTopic: 'Browse by Topic',
    clearFilter: 'Clear Filter',
    allResources: 'All Resources',
    savedResources: 'Your Saved Resources',
    resourcesCount: (count: number) => `${count} resources`,
    availableIn: (lang: string) => `Available in ${lang}`,
    saves: (count: number) => `${count} saves`,
    difficultyLabel: 'Difficulty',
    start: 'Start',
    savedEmptyTitle: 'No saved resources yet',
    savedEmptyDescription: 'Start saving resources you find helpful by clicking the bookmark icon.',
    savedEmptyAction: 'Browse Resources',
    emptyTitle: 'No resources found',
    emptyDescription: 'Try adjusting your search or browse different categories.',
    emptyAction: 'Clear Filters',
    languageLabel: 'Language',
  },
  hi: {
    title: 'कल्याण संसाधन',
    subtitle: 'आपकी मानसिक स्वास्थ्य यात्रा के लिए व्यावहारिक उपकरण',
    saved: 'सहेजे गए',
    searchPlaceholder: 'तनाव राहत, नींद सुझाव, संबंध सलाह खोजें...',
    totalResources: 'कुल संसाधन',
    savedByYou: 'आप द्वारा सहेजे गए',
    newThisWeek: 'इस सप्ताह नए',
    featuredTitle: '✨ इस सप्ताह नया',
    featuredBadge: 'ताज़ा सामग्री',
    browseByTopic: 'विषय के अनुसार ब्राउज़ करें',
    clearFilter: 'फ़िल्टर साफ़ करें',
    allResources: 'सभी संसाधन',
    savedResources: 'आपके सहेजे गए संसाधन',
    resourcesCount: (count: number) => `${count} संसाधन`,
    availableIn: (lang: string) => `${lang} में उपलब्ध`,
    saves: (count: number) => `${count} सेव`,
    difficultyLabel: 'स्तर',
    start: 'शुरू करें',
    savedEmptyTitle: 'अभी तक कोई सहेजा संसाधन नहीं',
    savedEmptyDescription: 'बुकमार्क आइकन पर क्लिक करके अपने पसंदीदा संसाधनों को सहेजें.',
    savedEmptyAction: 'संसाधन ब्राउज़ करें',
    emptyTitle: 'कोई संसाधन नहीं मिला',
    emptyDescription: 'अपनी खोज समायोजित करें या विभिन्न श्रेणियां ब्राउज़ करें.',
    emptyAction: 'फ़िल्टर साफ़ करें',
    languageLabel: 'भाषा',
  },
} as const;

type Language = keyof typeof translations;

// Video URL mapping for resources
const videoUrlMap: { [key: string]: string } = {
  '5-Minute Calm Before Exams': 'https://www.youtube.com/watch?v=wE292vsJcBY&t=150s',
  'Breaking the Worry Cycle': 'https://www.youtube.com/watch?v=s_Ikc1zHrCE',
  'Pressure Cooker to Peace: Managing Family Expectations': 'https://www.youtube.com/shorts/40kNhFMTN6g',
  'Student Sleep Rescue Plan': 'https://www.youtube.com/watch?v=2jr6aisK3NE',
  'Deep Sleep Meditation': 'https://www.youtube.com/watch?v=lu_cLaBTXio',
  'Talking to Parents About Mental Health': 'https://www.youtube.com/watch?v=QTy3WQgbt9E',
  'Friendship Boundaries in College': 'https://www.youtube.com/watch?v=Gf4FIt5DG4g',
  'Overcoming Self-Doubt': 'https://www.youtube.com/watch?v=ppBZj7vAFy4', // Same as Friendship Boundaries
  'Self-Compassion for Perfectionists': 'https://www.youtube.com/watch?v=Prjzmd_haTo', // Same as Friendship Boundaries
};

const allResources: Array<{
  id: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  type: 'audio' | 'video' | 'article';
  duration: Record<Language, string>;
  difficulty: 'Beginner' | 'Intermediate' | 'Important';
  category: string;
  rating: number;
  saves: number;
  isNew: boolean;
  language: string;
}> = [
  // Stress & Anxiety Resources
  {
    id: 1,
    title: {
      en: '5-Minute Calm Before Exams',
      hi: 'परीक्षा से पहले 5-मिनट की शांति',
    },
    description: {
      en: 'Quick breathing exercise to center yourself before any exam or presentation. Perfect for last-minute anxiety relief.',
      hi: 'किसी भी परीक्षा या प्रस्तुति से पहले आपको संतुलित करने के लिए त्वरित श्वास व्यायाम। अंतिम समय के तनाव से राहत के लिए बिल्कुल उपयुक्त।',
    },
    type: 'audio',
    duration: {
      en: '5 min',
      hi: '5 मिनट',
    },
    difficulty: 'Beginner',
    category: 'stress-management',
    rating: 4.9,
    saves: 1247,
    isNew: true,
    language: 'Hindi/English'
  },
  {
    id: 2,
    title: {
      en: 'Breaking the Worry Cycle',
      hi: 'चिंता के चक्र को तोड़ना',
    },
    description: {
      en: 'Evidence-based techniques to stop overthinking and manage academic anxiety effectively.',
      hi: 'अत्यधिक सोच को रोकने और शैक्षणिक चिंता को प्रभावी ढंग से प्रबंधित करने की प्रमाणित तकनीकें।',
    },
    type: 'article',
    duration: {
      en: '7 min read',
      hi: '7 मिनट पढ़ें',
    },
    difficulty: 'Intermediate',
    category: 'stress-management',
    rating: 4.8,
    saves: 892,
    isNew: false,
    language: 'English'
  },
  {
    id: 3,
    title: {
      en: 'Pressure Cooker to Peace: Managing Family Expectations',
      hi: 'प्रेशर कुकर से शांति: पारिवारिक अपेक्षाओं का प्रबंधन',
    },
    description: {
      en: 'Navigate cultural expectations while protecting your mental health. Practical strategies for Indian students.',
      hi: 'अपने मानसिक स्वास्थ्य की रक्षा करते हुए सांस्कृतिक अपेक्षाओं को संतुलित करें। भारतीय छात्रों के लिए व्यावहारिक रणनीतियाँ।',
    },
    type: 'video',
    duration: {
      en: '12 min',
      hi: '12 मिनट',
    },
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
    title: {
      en: 'Student Sleep Rescue Plan',
      hi: 'छात्र नींद बचाव योजना',
    },
    description: {
      en: 'Transform your sleep schedule even with unpredictable college routines. Science-backed sleep hygiene tips.',
      hi: 'अनियमित कॉलेज रूटीन के बावजूद अपनी नींद को संतुलित करें। विज्ञान-समर्थित नींद स्वच्छता सुझाव।',
    },
    type: 'article',
    duration: {
      en: '8 min read',
      hi: '8 मिनट पढ़ें',
    },
    difficulty: 'Beginner',
    category: 'sleep-wellness',
    rating: 4.7,
    saves: 1543,
    isNew: false,
    language: 'English'
  },
  {
    id: 5,
    title: {
      en: 'Deep Sleep Meditation',
      hi: 'गहरी नींद ध्यान',
    },
    description: {
      en: 'Gentle guided meditation to help you fall asleep faster and sleep more deeply.',
      hi: 'गहरी और शीघ्र नींद के लिए सुकूनदायक निर्देशित ध्यान।',
    },
    type: 'audio',
    duration: {
      en: '20 min',
      hi: '20 मिनट',
    },
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
    title: {
      en: 'Talking to Parents About Mental Health',
      hi: 'माता-पिता से मानसिक स्वास्थ्य पर बात करना',
    },
    description: {
      en: 'How to have honest conversations with traditional parents about therapy and mental wellness.',
      hi: 'प्रचलित विचारों वाले माता-पिता से थेरेपी और मानसिक स्वास्थ्य पर खुलकर कैसे बात करें।',
    },
    type: 'video',
    duration: {
      en: '15 min',
      hi: '15 मिनट',
    },
    difficulty: 'Intermediate',
    category: 'relationships',
    rating: 4.9,
    saves: 3201,
    isNew: true,
    language: 'Hindi'
  },
  {
    id: 7,
    title: {
      en: 'Friendship Boundaries in College',
      hi: 'कॉलेज में दोस्ती की सीमाएं',
    },
    description: {
      en: 'Build healthy friendships and navigate social pressures without losing yourself.',
      hi: 'स्वस्थ मित्रता बनाएं और सामाजिक दबावों का सामना करते हुए स्वयं को संतुलित रखें।',
    },
    type: 'article',
    duration: {
      en: '6 min read',
      hi: '6 मिनट पढ़ें',
    },
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
    title: {
      en: 'Overcoming Self-Doubt',
      hi: 'स्वयं-संदेह पर विजय',
    },
    description: {
      en: 'Practical strategies to overcome self-doubt and build confidence',
      hi: 'स्वयं-संदेह को दूर करने और आत्मविश्वास बढ़ाने की व्यावहारिक रणनीतियाँ',
    },
    type: 'video',
    duration: {
      en: '18 min',
      hi: '18 मिनट',
    },
    difficulty: 'Intermediate',
    category: 'identity-growth',
    rating: 4.8,
    saves: 1432,
    isNew: false,
    language: 'English'
  },
  {
    id: 9,
    title: {
      en: 'Self-Compassion for Perfectionists',
      hi: 'परफेक्शनिस्ट के लिए आत्म-दया',
    },
    description: {
      en: 'Learn to be kind to yourself when you make mistakes or fall short of high expectations.',
      hi: 'जब आप गलती करते हैं या उच्च अपेक्षाओं पर खरे नहीं उतरते, तब खुद से दयालु होना सीखें।',
    },
    type: 'audio',
    duration: {
      en: '12 min',
      hi: '12 मिनट',
    },
    difficulty: 'Beginner',
    category: 'identity-growth',
    rating: 4.7,
    saves: 1876,
    isNew: true,
    language: 'Hindi/English'
  },


];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [savedResources, setSavedResources] = useState<Set<number>>(new Set([1, 3, 6]));
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
  const [selectedResourceTitle, setSelectedResourceTitle] = useState('');
  const { language } = useLanguage();
  const resourceRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const resourcesTopRef = useRef<HTMLDivElement | null>(null);

  const t = translations[language];

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
  const handleStartResource = (resourceTitle: Record<Language, string>) => {
    const videoUrl = videoUrlMap[resourceTitle.en];
    if (videoUrl) {
      setSelectedVideoUrl(videoUrl);
      setSelectedResourceTitle(resourceTitle[language]);
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

  const filteredResources = useMemo(() => {
    const searchTerm = searchQuery.trim().toLowerCase();

    return allResources.filter((resource) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        resource.title[language].toLowerCase().includes(searchTerm) ||
        resource.description[language].toLowerCase().includes(searchTerm);

      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      const matchesSaved = !showSavedOnly || savedResources.has(resource.id);

      return matchesSearch && matchesCategory && matchesSaved;
    });
  }, [language, searchQuery, selectedCategory, showSavedOnly, savedResources]);

  const selectedCategoryLabel = selectedCategory
    ? categories.find((category) => category.id === selectedCategory)?.name[language] ?? t.allResources
    : t.allResources;

  useEffect(() => {
    const headerOffset = 120;

    const scrollToPosition = (position: number) => {
      window.scrollTo({
        top: position,
        behavior: 'smooth',
      });
    };

    const scrollToResourceSectionTop = () => {
      if (!resourcesTopRef.current) return;

      const elementPosition =
        resourcesTopRef.current.getBoundingClientRect().top + window.scrollY;
      scrollToPosition(elementPosition - headerOffset);
    };

    if (!selectedCategory) {
      scrollToResourceSectionTop();
      return;
    }

    const firstResourceInCategory = filteredResources.find(
      (resource) => resource.category === selectedCategory
    );

    if (!firstResourceInCategory) {
      scrollToResourceSectionTop();
      return;
    }

    const target = resourceRefs.current[firstResourceInCategory.id];
    if (!target) {
      scrollToResourceSectionTop();
      return;
    }

    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    scrollToPosition(elementPosition - headerOffset);
  }, [filteredResources, selectedCategory]);

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

  const handleScrollToResource = (resourceId: number) => {
    const target = resourceRefs.current[resourceId];

    if (!target) return;

    const headerOffset = 120;
    const elementPosition = target.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
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
              <h1 className="mm-text-h1 text-foreground">{t.title}</h1>
              <p className="mm-text-small text-muted-foreground">
                {t.subtitle}
              </p>
            </div>
            <LanguageToggle />
            <Button
              variant={showSavedOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={showSavedOnly ? "mm-btn-primary mm-btn-sm" : "mm-btn-secondary mm-btn-sm"}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              {t.saved}
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
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
            <div className="mm-text-small text-muted-foreground">{t.totalResources}</div>
          </Card>
          <Card className="mm-card mm-p-3 text-center">
            <div className="mm-text-h2 text-secondary font-bold">{savedResources.size}</div>
            <div className="mm-text-small text-muted-foreground">{t.savedByYou}</div>
          </Card>
          <Card className="mm-card mm-p-3 text-center">
            <div className="mm-text-h2 text-accent font-bold">{allResources.filter(r => r.isNew).length}</div>
            <div className="mm-text-small text-muted-foreground">{t.newThisWeek}</div>
          </Card>
        </div>

        {/* Featured This Week */}
        {!showSavedOnly && (
          <section className="mb-8" aria-label={language === 'en' ? 'Browse by topic' : 'विषय के अनुसार ब्राउज़ करें'}>
            <div className="flex items-center mm-gap-2 mb-6">
              <h2 className="mm-text-h2 text-foreground">{t.featuredTitle}</h2>
              <Badge className="bg-accent text-white">{t.featuredBadge}</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 mm-gap-4">
              {featuredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                return (
                  <Card
                    key={resource.id}
                    className="mm-card mm-p-3 group cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden"
                    onClick={() => handleScrollToResource(resource.id)}
                  >
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

                    <h3 className="mm-text-h3 text-foreground mb-2">{resource.title[language]}</h3>
                    <p className="mm-text-small text-muted-foreground mb-4 line-clamp-3">
                      {resource.description[language]}
                    </p>

                    <div className="flex items-center justify-between mm-text-small">
                      <div className="flex items-center mm-gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {resource.duration[language]}
                      </div>
                      <div className="flex items-center mm-gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-muted-foreground">{resource.rating}</span>
                        </div>
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {language === 'en'
                            ? resource.difficulty
                            : resource.difficulty === 'Beginner'
                            ? 'शुरुआती'
                            : resource.difficulty === 'Intermediate'
                            ? 'मध्यम'
                            : resource.difficulty === 'Important'
                            ? 'महत्वपूर्ण'
                            : resource.difficulty}
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
              <h2 className="mm-text-h2 text-foreground">{t.browseByTopic}</h2>
              {selectedCategory && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="mm-btn-secondary mm-btn-sm"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {t.clearFilter}
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
                      <h3 className="mm-text-h3 text-foreground mb-2">{category.name[language]}</h3>
                      <p className="mm-text-xs text-muted-foreground mb-3 line-clamp-2">
                        {category.description[language]}
                      </p>
                      <Badge variant="outline" className="mm-text-xs">
                        {language === 'en' ? `${category.count} resources` : `${category.count} संसाधन`}
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
              {showSavedOnly ? t.savedResources : selectedCategoryLabel}
            </h2>
            <p className="mm-text-small text-muted-foreground">
              {t.resourcesCount(filteredResources.length)}
            </p>
          </div>

          {filteredResources.length === 0 ? (
            <EmptyState
              icon={showSavedOnly ? Bookmark : BookOpen}
              title={showSavedOnly ? t.savedEmptyTitle : t.emptyTitle}
              description={showSavedOnly 
                ? t.savedEmptyDescription
                : t.emptyDescription
              }
              actionLabel={showSavedOnly ? t.savedEmptyAction : t.emptyAction}
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
            <div className="space-y-4" ref={resourcesTopRef}>
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                const isSaved = savedResources.has(resource.id);
                
                return (
                  <div
                    key={resource.id}
                    ref={(element) => {
                      if (element) {
                        resourceRefs.current[resource.id] = element;
                      } else {
                        delete resourceRefs.current[resource.id];
                      }
                    }}
                  >
                    <Card className="mm-card mm-p-3 hover:scale-[1.005] transition-all group">
                      <div className="flex items-start mm-gap-4">
                        <div className={`w-16 h-16 ${getTypeColor(resource.type)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                          <TypeIcon className="h-8 w-8 text-white" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 mr-4">
                              <div className="flex items-center mm-gap-2 mb-1">
                                <h3 className="mm-text-h3 text-foreground">{resource.title[language]}</h3>
                                {resource.isNew && (
                                  <Badge className="bg-accent text-white mm-text-xs">{language === 'en' ? 'New' : 'नया'}</Badge>
                                )}
                              </div>
                              <p className="mm-text-small text-muted-foreground mb-3 leading-relaxed">
                                {resource.description[language]}
                              </p>
                              <div className="flex items-center mm-gap-2 mm-text-xs text-muted-foreground">
                                <span>{t.availableIn(resource.language)}</span>
                                <span>•</span>
                                <span>{t.saves(resource.saves)}</span>
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
                                {resource.duration[language]}
                              </div>
                              <Badge className={getDifficultyColor(resource.difficulty)}>
                                {language === 'en'
                                  ? resource.difficulty
                                  : resource.difficulty === 'Beginner'
                                  ? 'शुरुआती'
                                  : resource.difficulty === 'Intermediate'
                                  ? 'मध्यम'
                                  : resource.difficulty === 'Important'
                                  ? 'महत्वपूर्ण'
                                  : resource.difficulty}
                              </Badge>
                            </div>

                            <Button
                              size="sm"
                              className="mm-btn-primary mm-btn-sm group-hover:scale-105 transition-transform"
                              onClick={() => handleStartResource(resource.title)}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              {t.start}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Help Section */}
        <Card className="mt-8 mm-card mm-p-4 bg-gradient-to-br from-primary/5 to-secondary/5 text-center">
          <Heart className="h-8 w-8 text-primary mx-auto mb-4" />
          <h3 className="mm-text-h2 text-foreground mb-2">{language === 'en' ? 'Need Personal Guidance?' : 'क्या आपको व्यक्तिगत मार्गदर्शन चाहिए?'}</h3>
          <p className="mm-text-body text-muted-foreground mb-6">
            {language === 'en'
              ? 'These resources are great, but sometimes you need someone to talk to. Our counselors are here for you.'
              : 'ये संसाधन बहुत उपयोगी हैं, लेकिन कभी-कभी आपको किसी से बात करने की ज़रूरत होती है। हमारे परामर्शदाता आपके लिए हमेशा उपलब्ध हैं।'}
          </p>
          <div className="flex flex-col sm:flex-row mm-gap-3 justify-center">
            <Link to="/booking">
              <Button className="mm-btn-primary">
                <Shield className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Book a Session' : 'सत्र बुक करें'}
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Heart className="h-4 w-4 mr-2" />
                {language === 'en' ? 'Chat with Bestie AI' : 'बेस्टी AI से बात करें'}
              </Button>
            </Link>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 left-0 right-0 z-50">
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
                  {language === 'en'
                    ? 'Click outside the modal or press the X button to close'
                    : 'मोडल बंद करने के लिए बाहर क्लिक करें या X बटन दबाएँ'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                  className="mm-btn-secondary mm-btn-sm"
                >
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
