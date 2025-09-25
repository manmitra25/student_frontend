import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
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
  Clock
} from 'lucide-react';
import { useApp } from '../../App';
import Navigation from '../shared/Navigation';

export default function ProfilePage() {
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const stats = [
    { label: 'Days Active', value: '14', icon: Clock, color: 'trust-blue' },
    { label: 'Chat Sessions', value: '8', icon: Heart, color: 'healing-green' },
    { label: 'Resources Accessed', value: '12', icon: CheckCircle, color: 'warm-coral' },
    { label: 'Journal Entries', value: '6', icon: Edit3, color: 'soft-purple' }
  ];

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="bg-white border-b border-border-light sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-charcoal">Profile</h1>
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
          <Card className="p-6 border-0 shadow-lg bg-white">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-trust-blue/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-trust-blue" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-lg font-medium"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveProfile} className="bg-healing-green text-white">
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-charcoal">{user?.name}</h2>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-trust-blue text-white text-xs">
                          {user?.role === 'student' ? 'Student' : 'Counselor'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user?.college === 'mitaoe' ? 'MITAOE' : 
                           user?.college === 'coep' ? 'COEP' : 
                           user?.college === 'pict' ? 'PICT' : 'Other'}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-gray-50">
                    <div className={`w-8 h-8 bg-${stat.color}/10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className={`h-4 w-4 text-${stat.color}`} />
                    </div>
                    <div className="text-lg font-medium text-charcoal">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Privacy & Security */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-healing-green" />
              <h2 className="text-charcoal">Privacy & Security</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Data Encryption</h3>
                  <p className="text-xs text-muted-foreground">All your data is encrypted end-to-end</p>
                </div>
                <CheckCircle className="h-5 w-5 text-healing-green" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Anonymous Community</h3>
                  <p className="text-xs text-muted-foreground">Your identity is protected in community features</p>
                </div>
                <CheckCircle className="h-5 w-5 text-healing-green" />
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Professional Confidentiality</h3>
                  <p className="text-xs text-muted-foreground">Counselor sessions follow HIPAA guidelines</p>
                </div>
                <CheckCircle className="h-5 w-5 text-healing-green" />
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="border-trust-blue text-trust-blue hover:bg-trust-blue/5">
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data
                </Button>
                <Button variant="outline" className="border-warm-coral text-warm-coral hover:bg-warm-coral/5">
                  <Eye className="h-4 w-4 mr-2" />
                  Privacy Settings
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Notification Preferences */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-white">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-6 w-6 text-trust-blue" />
              <h2 className="text-charcoal">Notification Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Session Reminders</h3>
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
                  <h3 className="text-sm font-medium text-charcoal">Community Updates</h3>
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
                  <h3 className="text-sm font-medium text-charcoal">Wellness Check-ins</h3>
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
                  <h3 className="text-sm font-medium text-charcoal">Crisis Alerts</h3>
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
          <Card className="p-6 border-0 shadow-lg bg-white">
            <h2 className="text-charcoal mb-4">Account Actions</h2>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-trust-blue text-trust-blue hover:bg-trust-blue/5">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-warm-coral text-warm-coral hover:bg-warm-coral/5">
                <Download className="h-4 w-4 mr-2" />
                Export Journal Entries
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-gray-300 text-charcoal hover:bg-gray-50">
                <EyeOff className="h-4 w-4 mr-2" />
                Deactivate Account
              </Button>
              
              <Button variant="outline" className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account & Data
              </Button>
            </div>
          </Card>
        </section>

        {/* Support & Feedback */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-soft-purple/5 to-warm-coral/5">
            <div className="text-center">
              <Heart className="h-8 w-8 text-warm-coral mx-auto mb-3" />
              <h3 className="text-charcoal mb-2">We Value Your Voice</h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Your feedback helps us improve ManMitra for all students. 
                Share your thoughts, suggestions, or report any issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" className="border-trust-blue text-trust-blue hover:bg-trust-blue/5">
                  Share Feedback
                </Button>
                <Button variant="outline" className="border-healing-green text-healing-green hover:bg-healing-green/5">
                  Contact Support
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Logout */}
        <div className="text-center">
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Navigation />
      </div>
    </div>
  );
}