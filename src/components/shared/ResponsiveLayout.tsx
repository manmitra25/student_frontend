import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  ArrowLeft,
  Settings,
  Bell,
  Home,
  MessageCircle,
  Heart,
  Calendar,
  Users,
} from 'lucide-react';
import Navigation from './Navigation';
import { useApp } from '../../App';

interface ResponsiveLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  headerActions?: ReactNode;
  className?: string;
}

export default function ResponsiveLayout({
  children,
  title,
  subtitle,
  showBack = false,
  backTo = '/dashboard',
  headerActions,
  className = '',
}: ResponsiveLayoutProps) {
  const { user } = useApp() as any;

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:flex lg:h-screen">
        <div className="w-80 bg-card border-r border-border flex flex-col">
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">M</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">ManMitra</h1>
                <p className="text-sm text-muted-foreground">Mental Health Platform</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
                <Home className="h-5 w-5 text-primary" />
                <span className="font-medium">Home</span>
              </Link>
              <Link to="/chat" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">AI Support</p>
                  <p className="text-xs text-muted-foreground">First-aid guidance</p>
                </div>
              </Link>
              <Link to="/mood" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
                <Heart className="h-5 w-5 text-secondary" />
                <div>
                  <p className="font-medium">Wellness Tracking</p>
                  <p className="text-xs text-muted-foreground">Mood & habits</p>
                </div>
              </Link>
              <Link to="/booking" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium">Counsellor Booking</p>
                  <p className="text-xs text-muted-foreground">Professional support</p>
                </div>
              </Link>
              <Link to="/community" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
                <Users className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Community Hub</p>
                  <p className="text-xs text-muted-foreground">Resources & peers</p>
                </div>
              </Link>
            </nav>
          </div>

          <div className="p-4 border-t border-border">
            <Link to="/profile" className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{user?.name || 'Student'}</p>
                <p className="text-xs text-muted-foreground">{user?.college || 'Campus'}</p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-card border-b border-border px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {showBack && (
                  <Link to={backTo}>
                    <Button variant="ghost" size="sm">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                  {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {headerActions}
                <Button variant="ghost" size="sm">
                  <Bell className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className={`max-w-4xl mx-auto p-8 ${className}`}>{children}</div>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <div className="bg-card border-b border-border px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showBack && (
                <Link to={backTo}>
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <div>
                <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">{headerActions}</div>
          </div>
        </div>

        <div className={`pb-20 px-4 pt-6 ${className}`}>{children}</div>

        <Navigation />
      </div>
    </div>
  );
}