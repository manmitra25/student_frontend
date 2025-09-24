import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  BookOpen,
  BarChart3,
  GraduationCap,
  AlertCircle,
  CheckCircle,
  Brain,
  Coffee,
  Moon,
  Plus
} from 'lucide-react';
import Navigation from '../shared/Navigation';

const academicData = {
  gpa: 8.2,
  targetGPA: 8.5,
  semester: "Semester 6",
  completedCredits: 145,
  totalCredits: 180,
  subjects: [
    { name: "Data Structures", grade: "A", credits: 4, status: "completed" },
    { name: "Machine Learning", grade: "A-", credits: 4, status: "completed" },
    { name: "Software Engineering", grade: "B+", credits: 3, status: "ongoing" },
    { name: "Database Systems", grade: null, credits: 4, status: "ongoing" },
    { name: "Computer Networks", grade: null, credits: 3, status: "upcoming" }
  ],
  weeklyGoals: [
    { task: "Complete ML Assignment 3", deadline: "Today", status: "pending", priority: "high" },
    { task: "Study for Database Quiz", deadline: "Tomorrow", status: "completed", priority: "medium" },
    { task: "Prepare SE Project Demo", deadline: "This Week", status: "pending", priority: "high" },
    { task: "Read Networks Chapter 5", deadline: "Next Week", status: "pending", priority: "low" }
  ],
  wellnessMetrics: {
    studyHours: 35,
    sleepAverage: 6.5,
    stressLevel: 3,
    exerciseMinutes: 120
  }
};

const stressFactors = [
  { factor: "Upcoming Exams", impact: "High", color: "destructive" },
  { factor: "Project Deadlines", impact: "Medium", color: "accent" },
  { factor: "Job Applications", impact: "High", color: "destructive" },
  { factor: "Family Pressure", impact: "Low", color: "secondary" }
];

export default function AcademicTrackingPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'subjects' | 'wellness'>('overview');

  const getGradeColor = (grade: string) => {
    if (grade?.startsWith('A')) return 'text-secondary';
    if (grade?.startsWith('B')) return 'text-primary';
    if (grade?.startsWith('C')) return 'text-accent';
    return 'text-muted-foreground';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-destructive text-destructive bg-destructive/5';
      case 'medium': return 'border-accent text-accent bg-accent/5';
      case 'low': return 'border-secondary text-secondary bg-secondary/5';
      default: return 'border-border text-muted-foreground';
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
              <h1 className="mm-text-h2 text-foreground">Academic Tracker</h1>
              <p className="mm-text-small text-muted-foreground">
                Monitor your academic progress and mental wellness
              </p>
            </div>
            <Button size="sm" className="mm-btn-primary">
              <Plus className="h-4 w-4 mr-1" />
              Add Goal
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mm-gap-1 bg-muted/30 p-1 rounded-lg">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'subjects', label: 'Subjects', icon: BookOpen },
              { id: 'wellness', label: 'Wellness', icon: Brain }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center mm-gap-2 px-4 py-2 rounded-md transition-all flex-1 justify-center ${
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
            {/* Academic Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="mm-card mm-p-3 text-center">
                <div className="mm-text-h2 text-secondary font-bold">{academicData.gpa}</div>
                <div className="mm-text-xs text-muted-foreground">Current GPA</div>
                <div className="mm-text-xs text-primary">Target: {academicData.targetGPA}</div>
              </Card>
              <Card className="mm-card mm-p-3 text-center">
                <div className="mm-text-h2 text-primary font-bold">{academicData.completedCredits}</div>
                <div className="mm-text-xs text-muted-foreground">Credits Completed</div>
                <div className="mm-text-xs text-accent">{academicData.totalCredits - academicData.completedCredits} remaining</div>
              </Card>
              <Card className="mm-card mm-p-3 text-center">
                <div className="mm-text-h2 text-accent font-bold">{academicData.weeklyGoals.filter(g => g.status === 'completed').length}</div>
                <div className="mm-text-xs text-muted-foreground">Goals Completed</div>
                <div className="mm-text-xs text-primary">This Week</div>
              </Card>
              <Card className="mm-card mm-p-3 text-center">
                <div className="mm-text-h2 text-violet-500 font-bold">{academicData.wellnessMetrics.studyHours}h</div>
                <div className="mm-text-xs text-muted-foreground">Study Hours</div>
                <div className="mm-text-xs text-secondary">This Week</div>
              </Card>
            </div>

            {/* Progress Tracking */}
            <Card className="mm-card mm-p-4">
              <h3 className="mm-text-h3 text-foreground mb-4 flex items-center mm-gap-2">
                <Target className="h-5 w-5 text-primary" />
                Semester Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="mm-text-small text-foreground">Credits Completion</span>
                    <span className="mm-text-small text-muted-foreground">
                      {academicData.completedCredits} / {academicData.totalCredits}
                    </span>
                  </div>
                  <Progress value={(academicData.completedCredits / academicData.totalCredits) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="mm-text-small text-foreground">GPA Progress</span>
                    <span className="mm-text-small text-muted-foreground">
                      {academicData.gpa} / {academicData.targetGPA}
                    </span>
                  </div>
                  <Progress value={(academicData.gpa / academicData.targetGPA) * 100} className="h-2" />
                </div>
              </div>
            </Card>

            {/* Weekly Goals */}
            <Card className="mm-card mm-p-4">
              <h3 className="mm-text-h3 text-foreground mb-4 flex items-center mm-gap-2">
                <CheckCircle className="h-5 w-5 text-secondary" />
                This Week's Goals
              </h3>
              <div className="space-y-3">
                {academicData.weeklyGoals.map((goal, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(goal.priority)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="mm-text-small font-medium">{goal.task}</h4>
                        <div className="flex items-center mm-gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span className="mm-text-xs text-muted-foreground">{goal.deadline}</span>
                          <Badge className={`mm-text-xs ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                          </Badge>
                        </div>
                      </div>
                      {goal.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-secondary" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-muted rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Subjects Tab */}
        {activeTab === 'subjects' && (
          <div className="space-y-4">
            {academicData.subjects.map((subject, index) => (
              <Card key={index} className="mm-card mm-p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="mm-text-h3 text-foreground">{subject.name}</h3>
                    <div className="flex items-center mm-gap-3 mt-1">
                      <span className="mm-text-small text-muted-foreground">{subject.credits} Credits</span>
                      <Badge className={`mm-text-xs ${
                        subject.status === 'completed' ? 'bg-secondary text-white' :
                        subject.status === 'ongoing' ? 'bg-primary text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {subject.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    {subject.grade ? (
                      <div className={`mm-text-h3 font-bold ${getGradeColor(subject.grade)}`}>
                        {subject.grade}
                      </div>
                    ) : (
                      <div className="mm-text-small text-muted-foreground">In Progress</div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Wellness Tab */}
        {activeTab === 'wellness' && (
          <div className="space-y-6">
            {/* Wellness Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="mm-card mm-p-4">
                <div className="flex items-center mm-gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <div className="mm-text-h3 text-foreground">{academicData.wellnessMetrics.studyHours}h</div>
                    <div className="mm-text-small text-muted-foreground">Study Hours/Week</div>
                  </div>
                </div>
              </Card>
              <Card className="mm-card mm-p-4">
                <div className="flex items-center mm-gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Moon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="mm-text-h3 text-foreground">{academicData.wellnessMetrics.sleepAverage}h</div>
                    <div className="mm-text-small text-muted-foreground">Avg Sleep/Night</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stress Factors */}
            <Card className="mm-card mm-p-4">
              <h3 className="mm-text-h3 text-foreground mb-4 flex items-center mm-gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                Current Stress Factors
              </h3>
              <div className="space-y-3">
                {stressFactors.map((stress, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="mm-text-small text-foreground">{stress.factor}</span>
                    <Badge className={`mm-text-xs ${
                      stress.impact === 'High' ? 'bg-destructive text-white' :
                      stress.impact === 'Medium' ? 'bg-accent text-white' :
                      'bg-secondary text-white'
                    }`}>
                      {stress.impact} Impact
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Wellness Actions */}
            <Card className="mm-card mm-p-4">
              <h3 className="mm-text-h3 text-foreground mb-4">Recommended Actions</h3>
              <div className="space-y-3">
                <Link to="/resources/stress-management">
                  <div className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center mm-gap-3">
                      <Brain className="h-5 w-5 text-accent" />
                      <div>
                        <div className="mm-text-small font-medium text-foreground">Stress Management</div>
                        <div className="mm-text-xs text-muted-foreground">Learn techniques to handle exam pressure</div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="/booking">
                  <div className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center mm-gap-3">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <div>
                        <div className="mm-text-small font-medium text-foreground">Academic Counseling</div>
                        <div className="mm-text-xs text-muted-foreground">Get guidance on study strategies</div>
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to="/community">
                  <div className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex items-center mm-gap-3">
                      <Coffee className="h-5 w-5 text-secondary" />
                      <div>
                        <div className="mm-text-small font-medium text-foreground">Study Groups</div>
                        <div className="mm-text-xs text-muted-foreground">Connect with peers for collaborative learning</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>
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