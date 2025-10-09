import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Heart, UserCheck, Users, BookOpen } from 'lucide-react';

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className = '' }: NavigationProps) {
  const location = useLocation();
  
  const navItems = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: 'Home'
    },
    { 
      path: '/chat', 
      icon: MessageCircle, 
      label: 'Bestie Chat'
    },
    { 
      path: '/resources',
      icon: BookOpen,
      label: 'Resources'
    },
    { 
      path: '/booking', 
      icon: UserCheck, 
      label: 'Counsellor'
    },
    { 
      path: '/mood', 
      icon: Heart, 
      label: 'Wellness'
    },
    { 
      path: '/community', 
      icon: Users, 
      label: 'Community'
    }
  ];

  return (
    <nav className={`bg-card/95 backdrop-blur-sm border-t border-border safe-area-bottom ${className}`}>
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/dashboard' && location.pathname === '/');
          
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center mm-gap-1 p-2 rounded-lg transition-all min-w-[56px] ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="mm-text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}