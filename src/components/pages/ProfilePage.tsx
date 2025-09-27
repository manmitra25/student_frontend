import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Bell, 
  Heart, 
  Settings, 
  LogOut, 
  Edit3,
  Download,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  MessageSquare,
  BookOpenCheck,
  Users,
  PenTool,
  FileText,
  AlertTriangle,
  X
} from 'lucide-react';
import { useApp } from '../../App';
import Navigation from '../shared/Navigation';
import ConsentModal from '../shared/ConsentModal';

export default function ProfilePage() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [featuresDialogOpen, setFeaturesDialogOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  
  // Edit profile form state
  const [editForm, setEditForm] = useState({
    age: user?.age || '',
    gender: user?.gender || '',
    occupation: user?.occupation || ''
  });
  
  // Consent state
  const [consent, setConsent] = useState({
    summarySharing: localStorage.getItem('consent_summary_sharing') === 'true',
    dataAnalytics: localStorage.getItem('consent_data_analytics') === 'true',
    personalizedContent: localStorage.getItem('consent_personalized_content') === 'true'
  });
  
  const [notifications, setNotifications] = useState({
    sessionReminders: true,
    communityUpdates: false,
    wellnessCheckins: true,
    crisisAlerts: true
  });

  const handleSaveProfile = () => {
    if (user) {
      setUser({ ...user, name: editedName });
    }
    setIsEditing(false);
  };

  const handleSaveEditProfile = () => {
    if (user) {
      setUser({ 
        ...user, 
        age: editForm.age,
        gender: editForm.gender,
        occupation: editForm.occupation
      });
    }
    setEditDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear consent data on logout
    localStorage.removeItem('consent_summary_sharing');
    localStorage.removeItem('consent_data_analytics');
    localStorage.removeItem('consent_personalized_content');
    setUser(null);
    setLogoutDialogOpen(false);
    navigate('/');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion logic
    console.log('Delete account requested');
    setDeleteAccountDialogOpen(false);
  };

  const handleConsentChange = (key: string, value: boolean) => {
    const newConsent = { ...consent, [key]: value };
    setConsent(newConsent);
    localStorage.setItem(`consent_${key}`, value.toString());
  };

  const handleConsentModalConsent = (allowed: boolean) => {
    // Update the summary sharing consent specifically
    handleConsentChange('summarySharing', allowed);
    // Also sync with ChatPage consent state
    localStorage.setItem('chat_summary_consent', allowed ? 'allowed' : 'denied');
    setConsentModalOpen(false);
  };

  const stats = [
    { label: 'Days Active', value: '14', icon: Clock, color: 'trust-blue' },
    { label: 'Chat Sessions', value: '8', icon: Heart, color: 'healing-green' },
    { label: 'Resources Accessed', value: '12', icon: CheckCircle, color: 'warm-coral' },
    { label: 'Journal Entries', value: '6', icon: Edit3, color: 'soft-purple' }
  ];

  const manMitraFeatures = [
    {
      title: 'Bestie',
      description: 'Your AI companion for academics, stress, and life challenges',
      icon: MessageSquare,
      color: 'text-primary'
    },
    {
      title: 'Counselors',
      description: 'Connect with licensed counselors who understand student life',
      icon: Users,
      color: 'text-secondary'
    },
    {
      title: 'Resources',
      description: 'Wellness resources, videos, and tools for your mental health journey',
      icon: BookOpenCheck,
      color: 'text-accent'
    },
    {
      title: 'Mood Logging',
      description: 'Track your daily mood and emotional well-being',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      title: 'Journaling',
      description: 'Express your thoughts and track your personal growth',
      icon: PenTool,
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-foreground">Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your account and privacy settings
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Profile Info */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-card">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h2 className="text-foreground text-xl font-semibold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-primary text-white text-xs">
                      {user?.role === 'student' ? 'Student' : 'Counselor'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {user?.college === 'mitaoe' ? 'MITAOE' : 
                       user?.college === 'coep' ? 'COEP' : 
                       user?.college === 'pict' ? 'PICT' : 'Other'}
                    </Badge>
                  </div>
                  <div className="mt-2 space-y-1">
                    {user?.age && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Age:</span> {user.age}
                      </p>
                    )}
                    {user?.gender && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Gender:</span> {user.gender}
                      </p>
                    )}
                    {user?.occupation && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Occupation:</span> {user.occupation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information. Name and email cannot be changed.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={user?.name || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={editForm.gender} onValueChange={(value) => setEditForm({...editForm, gender: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="transgender">Transgender</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer Not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="occupation">Occupation</Label>
                      <Select value={editForm.occupation} onValueChange={(value) => setEditForm({...editForm, occupation: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="working-professional">Working Professional</SelectItem>
                          <SelectItem value="others">Others</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEditProfile}>
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-muted/50">
                    <div className={`w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className={`h-4 w-4 text-primary`} />
                    </div>
                    <div className="text-lg font-medium text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Features Section */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Heart className="h-6 w-6 text-accent" />
                <h2 className="text-foreground">Our Features</h2>
              </div>
              <Dialog open={featuresDialogOpen} onOpenChange={setFeaturesDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    View All Features
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>ManMitra Features</DialogTitle>
                    <DialogDescription>
                      Discover all the features available in ManMitra to support your mental health journey.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {manMitraFeatures.map((feature) => {
                      const IconComponent = feature.icon;
                      return (
                        <div key={feature.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className={`h-5 w-5 ${feature.color}`} />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setFeaturesDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start border-primary/20 text-primary hover:bg-primary/5">
                    <FileText className="h-4 w-4 mr-2" />
                    Privacy & Policy
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                    <DialogDescription>
                      Read our privacy policy to understand how we protect your data.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Our privacy policy explains how we collect, use, and protect your personal information.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://manmitra.com/privacy-policy', '_blank')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Full Privacy Policy
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setPrivacyDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="justify-start border-secondary/20 text-secondary hover:bg-secondary/5">
                    <Shield className="h-4 w-4 mr-2" />
                    Terms of Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Terms of Service</DialogTitle>
                    <DialogDescription>
                      Read our terms of service to understand your rights and responsibilities.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Our terms of service outline the rules and regulations for using ManMitra.
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open('https://manmitra.com/terms-of-service', '_blank')}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      View Full Terms of Service
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setTermsDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                className="justify-start border-accent/20 text-accent hover:bg-accent/5"
                onClick={() => setConsentModalOpen(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Change Consent
              </Button>
            </div>
          </Card>
        </section>

        {/* Consent Section */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-accent" />
              <h2 className="text-foreground">Consent & Data Sharing</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Summary Sharing</h3>
                  <p className="text-xs text-muted-foreground">Allow AI to share conversation summaries for better support</p>
                </div>
                <Switch
                  checked={consent.summarySharing}
                  onCheckedChange={(checked) => handleConsentChange('summarySharing', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Data Analytics</h3>
                  <p className="text-xs text-muted-foreground">Help improve our services through anonymous usage data</p>
                </div>
                <Switch
                  checked={consent.dataAnalytics}
                  onCheckedChange={(checked) => handleConsentChange('dataAnalytics', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Personalized Content</h3>
                  <p className="text-xs text-muted-foreground">Receive personalized recommendations and content</p>
                </div>
                <Switch
                  checked={consent.personalizedContent}
                  onCheckedChange={(checked) => handleConsentChange('personalizedContent', checked)}
                />
              </div>
            </div>
            
            {consent.summarySharing && (
              <div className="mt-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <p className="text-sm text-accent font-medium">Summary sharing enabled</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Your conversation summaries will be used to provide better support and recommendations.
                </p>
              </div>
            )}
          </Card>
        </section>

        {/* Privacy & Security */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-accent" />
              <h2 className="text-foreground">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Data Encryption</h3>
                  <p className="text-xs text-muted-foreground">All your data is encrypted end-to-end</p>
                </div>
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Anonymous Community</h3>
                  <p className="text-xs text-muted-foreground">Your identity is protected in community features</p>
                </div>
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Professional Confidentiality</h3>
                  <p className="text-xs text-muted-foreground">Counselor sessions follow HIPAA guidelines</p>
                </div>
                <CheckCircle className="h-5 w-5 text-accent" />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/5">
                  <Eye className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Notification Preferences */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-primary" />
              <h2 className="text-foreground">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Session Reminders</h3>
                  <p className="text-xs text-muted-foreground">Get notified before your counseling sessions</p>
                </div>
                <Switch
                  checked={notifications.sessionReminders}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, sessionReminders: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Community Updates</h3>
                  <p className="text-xs text-muted-foreground">New posts in channels you follow</p>
                </div>
                <Switch
                  checked={notifications.communityUpdates}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, communityUpdates: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Wellness Check-ins</h3>
                  <p className="text-xs text-muted-foreground">Gentle reminders for mood tracking and journaling</p>
                </div>
                <Switch
                  checked={notifications.wellnessCheckins}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, wellnessCheckins: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Crisis Alerts</h3>
                  <p className="text-xs text-muted-foreground">Important safety and crisis support information</p>
                </div>
                <Switch
                  checked={notifications.crisisAlerts}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, crisisAlerts: checked }))
                  }
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Account Actions */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-card">
            <h2 className="text-foreground mb-4">Account Actions</h2>
            
            <div className="space-y-3">
              <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start border-destructive text-destructive hover:bg-destructive/5">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Delete Account
                    </DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                      Are you sure you want to delete your account? All your data including:
                    </p>
                    <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                      <li>Chat history and conversations</li>
                      <li>Journal entries and mood logs</li>
                      <li>Profile information and preferences</li>
                      <li>All other personal data</li>
                    </ul>
                    <p className="mt-2 text-sm font-medium text-destructive">
                      This action is permanent and cannot be reversed.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </section>

        {/* Support & Feedback */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <div className="text-center">
              <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
              <h3 className="text-foreground mb-2">We Value Your Voice</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Your feedback helps us improve ManMitra for all students. 
                Share your thoughts, suggestions, or report any issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  Share Feedback
                </Button>
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/5">
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Logout */}
        <div className="text-center">
          <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="border-destructive text-destructive hover:bg-destructive/5"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign Out</DialogTitle>
                <DialogDescription>
                  Are you sure you want to sign out? You'll need to log in again to access your account.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Your session will be ended and you'll be redirected to the login page.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Sign Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Navigation />
      </div>

      {/* Consent Modal */}
      <ConsentModal
        isOpen={consentModalOpen}
        onClose={() => setConsentModalOpen(false)}
        onConsent={handleConsentModalConsent}
      />
    </div>
  );
}