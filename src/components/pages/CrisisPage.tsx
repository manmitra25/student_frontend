import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Phone, 
  MessageCircle, 
  Heart, 
  Shield, 
  Clock, 
  MapPin,
  ArrowLeft,
  ExternalLink,
  Users,
  Headphones,
  AlertTriangle,
  PenTool,
  Calendar,
  BookOpen
} from 'lucide-react';

const crisisResources = [
    {
    id: 'tele-manas',
    name: 'Tele MANAS Helpline',
    phone: '14416',
    description: 'Government of India’s 24×7 toll-free mental health helpline offering immediate psychological support, counseling, and referral services.',
    availability: '24/7',
    type: 'mental-health',
    languages: ['English', 'Hindi', 'Regional Languages'],
    category: 'Mental Health Support'
  },
  {
    id: 'national-suicide-prevention',
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    description: '24/7 crisis support and suicide prevention',
    availability: '24/7',
    type: 'emergency',
    languages: ['English', 'Spanish'],
    category: 'Immediate Crisis'
  },
  {
    id: 'crisis-text-line',
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free crisis counseling via text',
    availability: '24/7',
    type: 'text',
    languages: ['English', 'Hindi'],
    category: 'Text Support'
  },
  {
    id: 'local-emergency',
    name: 'Emergency Services',
    phone: '911',
    description: 'Immediate medical/psychiatric emergency',
    availability: '24/7',
    type: 'emergency',
    languages: ['Multiple'],
    category: 'Emergency'
  },
  {
    id: 'student-counseling',
    name: 'Campus Counseling Services',
    phone: '98765',
    description: 'On-campus mental health support',
    availability: 'Business Hours',
    type: 'counseling',
    languages: ['English', 'Hindi', 'Marathi'],
    category: 'Campus Support'
  }
];

const safetyPlanSteps = [
  {
    id: 1,
    title: 'Recognize warning signs',
    description: 'Physical sensations, thoughts, emotions, or behaviors that might lead to crisis',
    icon: AlertTriangle
  },
  {
    id: 2,
    title: 'Identify coping strategies',
    description: 'Activities you can do on your own to take your mind off problems',
    icon: Heart
  },
  {
    id: 3,
    title: 'Contact supportive people',
    description: 'Friends, family, or peers who can provide support and distraction',
    icon: Users
  },
  {
    id: 4,
    title: 'Reach out to professionals',
    description: 'Mental health professionals, crisis lines, or emergency services',
    icon: Phone
  },
  {
    id: 5,
    title: 'Make environment safe',
    description: 'Remove or secure potential means of harm',
    icon: Shield
  }
];

export default function CrisisPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', 'Immediate Crisis', 'Text Support', 'Emergency', 'Campus Support'];
  
  const filteredResources = selectedCategory === 'all' 
    ? crisisResources 
    : crisisResources.filter(resource => resource.category === selectedCategory);

  const handleCallResource = (phone: string) => {
    if (phone.includes('Text')) {
      // Handle text instructions
      alert('To use Crisis Text Line, send a text message with "HOME" to 741741');
    } else {
      window.location.href = `tel:${phone.replace(/[^\d]/g, '')}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Alert Banner */}
      <div className="bg-gradient-to-r from-warm-coral to-warm-coral/90 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0" />
            <div className="flex-1">
              <h1 className="font-medium mb-1">Crisis Support Resources</h1>
              <p className="text-sm opacity-90">
                If you're in immediate danger, call 911 or go to your nearest emergency room.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h2 className="text-foreground">You're Not Alone</h2>
              <p className="text-sm text-muted-foreground">
                Help is available 24/7. Your life has value and meaning.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-8">
        {/* Immediate Actions */}
        <section>
          <h2 className="text-foreground mb-4">Immediate Support</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-warm-coral/10 to-warm-coral/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-warm-coral/20 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-warm-coral" />
                </div>
                <div>
                  <h3 className="text-foreground">Call for Help</h3>
                  <p className="text-sm text-muted-foreground">Speak with someone now</p>
                </div>
              </div>
              <Button
                onClick={() => handleCallResource('988')}
                className="w-full crisis-support mb-3"
              >
                <Phone className="h-4 w-4 mr-2" />
                Call 14416 - TeleManas
              </Button>
              <Button
                onClick={() => handleCallResource('911')}
                variant="outline"
                className="w-full border-warm-coral text-warm-coral hover:bg-warm-coral/5"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Call 911 - Emergency
              </Button>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-trust-blue/10 to-trust-blue/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-trust-blue/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-trust-blue" />
                </div>
                <div>
                  <h3 className="text-foreground">Text Support</h3>
                  <p className="text-sm text-muted-foreground">Anonymous crisis counseling</p>
                </div>
              </div>
              <Button
                onClick={() => handleCallResource('Text HOME to 741741')}
                className="w-full bg-trust-blue hover:bg-trust-blue/90 text-white mb-3"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Text HOME to 741741
              </Button>
              <Link to="/chat">
                <Button
                  variant="outline"
                  className="w-full border-trust-blue text-trust-blue hover:bg-trust-blue/5"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Chat with Bestie AI
                </Button>
              </Link>
            </Card>
          </div>
        </section>

        {/* Crisis Resources */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground">All Crisis Resources</h2>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-trust-blue text-white" : ""}
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow bg-card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge 
                        className={`text-xs ${
                          resource.type === 'emergency' 
                            ? 'bg-warm-coral text-white' 
                            : resource.type === 'text'
                            ? 'bg-trust-blue text-white'
                            : 'bg-healing-green text-white'
                        }`}
                      >
                        {resource.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-healing-green">
                        <Clock className="h-4 w-4" />
                        {resource.availability}
                      </div>
                    </div>
                    
                    <h3 className="text-foreground mb-2">{resource.name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{resource.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Headphones className="h-4 w-4" />
                        {resource.languages.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-medium text-foreground mb-2">{resource.phone}</p>
                    <Button
                      onClick={() => handleCallResource(resource.phone)}
                      className={`${
                        resource.type === 'emergency' 
                          ? 'crisis-support' 
                          : 'bg-trust-blue hover:bg-trust-blue/90 text-white'
                      }`}
                    >
                      {resource.type === 'text' ? (
                        <>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Text Now
                        </>
                      ) : (
                        <>
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Planning */}
        <section>
          <h2 className="text-foreground mb-4">Create Your Safety Plan</h2>
          <p className="text-muted-foreground mb-6">
            A safety plan is a personalized plan that helps you stay safe during a crisis. 
            It's designed by you, for you, and helps you recognize warning signs and know what to do.
          </p>
          
          <div className="grid gap-4">
            {safetyPlanSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <Card key={step.id} className="p-6 border-0 shadow-lg bg-card">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-trust-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-trust-blue" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground mb-2">
                        Step {step.id}: {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{step.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/journal">
              <Button className="bg-healing-green hover:bg-healing-green/90 text-white">
                <PenTool className="h-4 w-4 mr-2" />
                Start Your Safety Plan
              </Button>
            </Link>
          </div>
        </section>

        {/* Additional Resources */}
        <section>
          <h2 className="text-foreground mb-4">Additional Support</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 border-0 shadow-lg bg-card">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-6 w-6 text-soft-purple" />
                <h3 className="text-foreground">Peer Support</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with others who understand what you're going through in our anonymous, safe community.
              </p>
              <Link to="/community">
                <Button variant="outline" className="w-full border-soft-purple text-soft-purple hover:bg-soft-purple/5">
                  Join Community
                </Button>
              </Link>
            </Card>

            <Card className="p-6 border-0 shadow-lg bg-card">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen className="h-6 w-6 text-warm-coral" />
                <h3 className="text-foreground">Wellness Resources</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Learn coping strategies, mindfulness techniques, and access professional educational content.
              </p>
              <Link to="/resources">
                <Button variant="outline" className="w-full border-warm-coral text-warm-coral hover:bg-warm-coral/5">
                  Browse Resources
                </Button>
              </Link>
            </Card>
          </div>
        </section>

        {/* Encouragement */}
        <Card className="p-8 border-0 shadow-xl bg-gradient-to-r from-trust-blue/5 via-healing-green/5 to-soft-purple/5 text-center">
          <Heart className="h-12 w-12 text-warm-coral mx-auto mb-4" />
          <h2 className="text-foreground mb-4">You Matter</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Crisis is temporary, but your life has lasting value. You deserve support, care, and hope. 
            Reaching out for help shows incredible strength and courage. You are not alone in this journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat">
              <Button className="bg-trust-blue hover:bg-trust-blue/90 text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Talk to Someone Now
              </Button>
            </Link>
            <Link to="/booking?urgent=true">
              <Button variant="outline" className="border-healing-green text-healing-green hover:bg-healing-green/5">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Emergency Session
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
}