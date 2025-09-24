import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`mm-empty-state ${className}`}>
      <Icon className="mm-empty-state-icon text-muted-foreground" />
      <h3 className="mm-empty-state-title">{title}</h3>
      <p className="mm-empty-state-description">{description}</p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="mt-6 mm-btn mm-btn-primary"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}