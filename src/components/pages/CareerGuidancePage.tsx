import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, 
  Briefcase, 
  TrendingUp, 
  Target,
  BookOpen,
  Users,
  Calendar,
  ExternalLink,
  Star,
  MapPin,
  Clock,
  Building,
  GraduationCap,
  Zap,
  Heart,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Navigation from '../shared/Navigation';

const careerAssessment = {
  completed: 75,
  skills: ['Problem Solving', 'Communication', 'Programming', 'Teamwork'],
  interests: ['Technology', 'Innovation', 'Social Impact'],
  values: ['Work-Life Balance', 'Growth', 'Autonomy']
};

const recommendedCareers = [
  {
    title: 'Software Engineer',
    company: 'Tech Startups',
    match: 92,
    salary: '₹8-15 LPA',
    growth: 'High',
    description: 'Design and develop software applications',
    skills: ['Programming', 'Problem Solving', 'Algorithms'],
    trending: true
  },
  {
    title: 'Product Manager',
    company: 'Various Industries',
    match: 85,
    salary: '₹12-25 LPA',
    growth: 'Very High',
    description: 'Lead product development and strategy',
    skills: ['Strategy', 'Communication', 'Analysis'],
    trending: true
  },
  {
    title: 'UX Designer',
    company: 'Design Studios',
    match: 78,
    salary: '₹6-12 LPA',
    growth: 'High',
    description: 'Create user-centered design experiences',
    skills: ['Design', 'Research', 'Empathy'],
    trending: false
  },
  {
    title: 'Data Scientist',
    company: 'Analytics Firms',
    match: 82,
    salary: '₹10-20 LPA',
    growth: 'Very High',
    description: 'Extract insights from complex data',
    skills: ['Statistics', 'Programming', 'Analytics'],
    trending: true
  }
];

const skillDevelopment = [
  {
    skill: 'Python Programming',
    progress: 65,
    timeToComplete: '2 months',
    relevantCareers: ['Software Engineer', 'Data Scientist'],
    priority: 'high'
  },
  {
    skill: 'Communication Skills',
    progress: 40,
    timeToComplete: '3 months',
    relevantCareers: ['Product Manager', 'Consultant'],
    priority: 'medium'
  },
  {
    skill: 'Design Thinking',
    progress: 25,
    timeToComplete: '4 months',
    relevantCareers: ['UX Designer', 'Product Manager'],
    priority: 'low'
  }
];

const upcomingEvents = [
  {
    title: 'Tech Career Fair 2024',
    date: 'Mar 15, 2024',
    time: '10:00 AM',
    location: 'Convention Center',
    type: 'Career Fair',
    attending: 150
  },
  {
    title: 'Resume Building Workshop',
    date: 'Mar 20, 2024',
    time: '2:00 PM',
    location: 'Online',
    type: 'Workshop',
    attending: 45
  },
  {
    title: 'Industry Leaders Panel',
    date: 'Mar 25, 2024',
    time: '6:00 PM',
    location: 'Auditorium',
    type: 'Panel Discussion',
    attending: 200
  }
];

const industryInsights = [
  {
    title: 'AI/ML Industry Boom',
    trend: 'Hot',
    growth: '+45%',
    description: 'Artificial Intelligence roles are growing rapidly with high demand for skilled professionals.',
    readTime: '3 min'
  },
  {
    title: 'Remote Work Evolution',
    trend: 'Stable',
    growth: '+15%',
    description: 'Remote and hybrid work models continue to shape the modern workplace.',
    readTime: '4 min'
  },
  {
    title: 'Green Tech Careers',
    trend: 'Emerging',
    growth: '+60%',
    description: 'Sustainability-focused roles are becoming increasingly important.',
    readTime: '5 min'
  }
];

export default function CareerGuidancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'careers' | 'skills' | 'events'>('overview');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-destructive text-destructive bg-destructive/5';
      case 'medium': return 'border-accent text-accent bg-accent/5';
      case 'low': return 'border-secondary text-secondary bg-secondary/5';
      default: return 'border-border text-muted-foreground';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Hot': return 'bg-destructive text-white';
      case 'Emerging': return 'bg-secondary text-white';
      case 'Stable': return 'bg-primary text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center mm-gap-3 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="mm-text-h2 text-foreground">Career Guidance</h1>
              <p className="mm-text-small text-muted-foreground">
                Discover your path and build your future
              </p>
            </div>
            <Button size="sm" className="mm-btn-primary">
              <Target className="h-4 w-4 mr-1" />
              Take Assessment
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mm-gap-1 bg-muted/30 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'careers', label: 'Careers', icon: Briefcase },
              { id: 'skills', label: 'Skills', icon: Zap },
              { id: 'events', label: 'Events', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center mm-gap-2 px-3 py-2 rounded-md transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="mm-text-small font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-24">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Career Assessment Progress */}
            <Card className="mm-card mm-p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="mm-text-h3 text-foreground">Career Assessment</h3>
                <Badge className="bg-primary text-white">{careerAssessment.completed}% Complete</Badge>
              </div>
              <Progress value={careerAssessment.completed} className="h-3 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="mm-text-small font-medium text-foreground mb-2">Top Skills</h4>
                  <div className="flex flex-wrap mm-gap-1">
                    {careerAssessment.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="mm-text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mm-text-small font-medium text-foreground mb-2">Interests</h4>
                  <div className="flex flex-wrap mm-gap-1">
                    {careerAssessment.interests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="mm-text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mm-text-small font-medium text-foreground mb-2">Values</h4>
                  <div className="flex flex-wrap mm-gap-1">
                    {careerAssessment.values.map((value, index) => (
                      <Badge key={index} variant="outline" className="mm-text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Industry Insights */}
            <div>
              <h3 className="mm-text-h3 text-foreground mb-4">Industry Insights</h3>
              <div className="space-y-3">
                {industryInsights.map((insight, index) => (
                  <Card key={index} className="mm-card mm-p-4 hover:scale-[1.01] transition-all cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mm-gap-2 mb-2">
                          <h4 className="mm-text-small font-medium text-foreground">{insight.title}</h4>
                          <Badge className={`mm-text-xs ${getTrendColor(insight.trend)}`}>
                            {insight.trend}
                          </Badge>
                          <Badge variant="outline" className="mm-text-xs text-secondary">
                            {insight.growth}
                          </Badge>
                        </div>
                        <p className="mm-text-small text-muted-foreground mb-2">{insight.description}</p>
                        <div className="flex items-center mm-gap-2 mm-text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {insight.readTime}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="mm-text-small font-medium text-foreground">Course Recommendations</div>
              </Card>
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="mm-text-small font-medium text-foreground">Mentorship</div>
              </Card>
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <BookOpen className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="mm-text-small font-medium text-foreground">Interview Prep</div>
              </Card>
              <Card className="mm-card mm-p-3 hover:scale-[1.02] transition-all cursor-pointer text-center">
                <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="mm-text-small font-medium text-foreground">Work-Life Balance</div>
              </Card>
            </div>
          </div>
        )}

        {/* Careers Tab */}
        {activeTab === 'careers' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="mm-text-h3 text-foreground">Recommended Careers</h3>
              <p className="mm-text-small text-muted-foreground">Based on your assessment and interests</p>
            </div>
            {recommendedCareers.map((career, index) => (
              <Card key={index} className="mm-card mm-p-4 hover:scale-[1.01] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mm-gap-2 mb-2">
                      <h4 className="mm-text-h3 text-foreground">{career.title}</h4>
                      {career.trending && (
                        <Badge className="bg-destructive text-white mm-text-xs">🔥 Trending</Badge>
                      )}
                    </div>
                    <p className="mm-text-small text-muted-foreground mb-3">{career.description}</p>
                    <div className="flex items-center mm-gap-4 mb-3">
                      <div className="flex items-center mm-gap-1">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <span className="mm-text-small text-muted-foreground">{career.company}</span>
                      </div>
                      <div className="flex items-center mm-gap-1">
                        <TrendingUp className="h-4 w-4 text-secondary" />
                        <span className="mm-text-small text-secondary">{career.growth} Growth</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap mm-gap-1">
                      {career.skills.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="mm-text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="mm-text-h3 text-primary font-bold">{career.match}%</div>
                    <div className="mm-text-xs text-muted-foreground mb-2">Match</div>
                    <div className="mm-text-small font-medium text-foreground">{career.salary}</div>
                  </div>
                </div>
                <div className="flex mm-gap-2">
                  <Button size="sm" className="mm-btn-primary flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Explore Path
                  </Button>
                  <Button size="sm" variant="outline" className="mm-btn-secondary">
                    <Users className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            <div>
              <h3 className="mm-text-h3 text-foreground mb-4">Skill Development Plan</h3>
              <div className="space-y-4">
                {skillDevelopment.map((skill, index) => (
                  <Card key={index} className={`mm-card mm-p-4 border-l-4 ${getPriorityColor(skill.priority)}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="mm-text-h3 text-foreground">{skill.skill}</h4>
                        <p className="mm-text-small text-muted-foreground">
                          Relevant for: {skill.relevantCareers.join(', ')}
                        </p>
                      </div>
                      <Badge className={`mm-text-xs ${getPriorityColor(skill.priority)}`}>
                        {skill.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="mm-text-small text-muted-foreground">Progress</span>
                        <span className="mm-text-small text-foreground">{skill.progress}%</span>
                      </div>
                      <Progress value={skill.progress} className="h-2" />
                      <div className="mm-text-xs text-muted-foreground">
                        Estimated completion: {skill.timeToComplete}
                      </div>
                    </div>

                    <Button size="sm" className="w-full mm-btn-secondary">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Start Learning
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Skill Recommendations */}
            <Card className="mm-card mm-p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
              <h4 className="mm-text-h3 text-foreground mb-3">Trending Skills to Learn</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['AI/ML', 'Cloud Computing', 'Cybersecurity', 'Data Analysis'].map((skill, index) => (
                  <div key={index} className="text-center p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                    <Zap className="h-6 w-6 text-accent mx-auto mb-1" />
                    <div className="mm-text-small font-medium text-foreground">{skill}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="mb-4">
              <h3 className="mm-text-h3 text-foreground">Upcoming Career Events</h3>
              <p className="mm-text-small text-muted-foreground">Network and learn from industry professionals</p>
            </div>
            {upcomingEvents.map((event, index) => (
              <Card key={index} className="mm-card mm-p-4 hover:scale-[1.01] transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mm-gap-2 mb-2">
                      <h4 className="mm-text-h3 text-foreground">{event.title}</h4>
                      <Badge variant="outline" className="mm-text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center mm-gap-2 mm-text-small text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center mm-gap-2 mm-text-small text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center mm-gap-2 mm-text-small text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {event.attending} attending
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex mm-gap-2">
                  <Button size="sm" className="mm-btn-primary flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                  <Button size="sm" variant="outline" className="mm-btn-secondary">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation />
      </div>
    </div>
  );
}