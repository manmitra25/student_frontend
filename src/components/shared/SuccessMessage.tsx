import { CheckCircle, AlertCircle } from 'lucide-react';

interface MessageProps {
  children: React.ReactNode;
  className?: string;
}

export function SuccessMessage({ children, className = '' }: MessageProps) {
  return (
    <div className={`mm-success ${className}`}>
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function ErrorMessage({ children, className = '' }: MessageProps) {
  return (
    <div className={`mm-error ${className}`}>
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}