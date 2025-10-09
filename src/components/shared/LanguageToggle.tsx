import { Button } from '../ui/button';
import { useLanguage, Language } from './LanguageProvider';

interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function LanguageToggle({ className = '', showLabel = true }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  const handleChange = (value: Language) => {
    setLanguage(value);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="mm-text-xs text-muted-foreground hidden sm:block">
          {language === 'en' ? 'Language:' : 'भाषा:'}
        </span>
      )}
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="xs"
        onClick={() => handleChange('en')}
      >
        English
      </Button>
      <Button
        variant={language === 'hi' ? 'default' : 'outline'}
        size="xs"
        onClick={() => handleChange('hi')}
      >
        हिन्दी
      </Button>
    </div>
  );
}
