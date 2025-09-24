import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { ArrowLeft, PenTool, Heart, Calendar, TrendingUp, Save, Lock, Smile } from 'lucide-react';
import Navigation from '../shared/Navigation';

const moodOptions = [
  { emoji: '😊', label: 'Great', value: 5, color: 'bg-healing-green' },
  { emoji: '🙂', label: 'Good', value: 4, color: 'bg-trust-blue' },
  { emoji: '😐', label: 'Okay', value: 3, color: 'bg-gray-400' },
  { emoji: '😕', label: 'Low', value: 2, color: 'bg-warm-coral' },
  { emoji: '😢', label: 'Difficult', value: 1, color: 'bg-red-500' }
];

const journalPrompts = [
  "What am I grateful for today?",
  "What challenge did I face today and how did I handle it?",
  "What brought me joy or made me smile today?",
  "What would I like to tell my past self?",
  "What am I looking forward to?",
  "How did I take care of myself today?",
  "What did I learn about myself today?",
  "Who or what made a positive impact on my day?"
];

const moodHistory = [
  { date: '2024-01-15', mood: 4, hasEntry: true },
  { date: '2024-01-14', mood: 3, hasEntry: true },
  { date: '2024-01-13', mood: 5, hasEntry: true },
  { date: '2024-01-12', mood: 2, hasEntry: false },
  { date: '2024-01-11', mood: 4, hasEntry: true },
  { date: '2024-01-10', mood: 3, hasEntry: true },
  { date: '2024-01-09', mood: 4, hasEntry: true }
];

export default function JournalPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalEntry, setJournalEntry] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveEntry = () => {
    if (selectedMood && journalEntry.trim()) {
      // In a real app, this would save to backend
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setJournalEntry(prev => prev + (prev ? '\n\n' : '') + prompt + '\n\n');
  };

  const getAverageMood = () => {
    const total = moodHistory.reduce((sum, day) => sum + day.mood, 0);
    return (total / moodHistory.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-soft-white">
      {/* Header */}
      <header className="bg-white border-b border-border-light sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-charcoal">Journal & Mood</h1>
                <p className="text-sm text-muted-foreground">
                  Daily reflection and mood tracking
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-healing-green" />
              <span className="text-xs text-healing-green">Private & Encrypted</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Today's Mood */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-white">
            <h2 className="text-charcoal mb-4">How are you feeling today?</h2>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    selectedMood === mood.value 
                      ? 'border-trust-blue bg-trust-blue/5 scale-105' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className="text-sm font-medium text-charcoal">{mood.label}</div>
                </button>
              ))}
            </div>
            
            {selectedMood && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Thank you for sharing. Your mood tracking helps you understand patterns over time.
                </p>
              </div>
            )}
          </Card>
        </section>

        {/* Journal Entry */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-charcoal">Today's Journal Entry</h2>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <Textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything you'd like to reflect on. This space is completely private and just for you."
                className="min-h-[200px] border-gray-200 focus:border-trust-blue resize-none"
              />
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Your entries are encrypted and completely private
                </p>
                <div className="flex items-center gap-2">
                  {isSaved && (
                    <span className="text-sm text-healing-green flex items-center gap-1">
                      <div className="w-2 h-2 bg-healing-green rounded-full"></div>
                      Saved
                    </span>
                  )}
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!selectedMood || !journalEntry.trim()}
                    className="bg-trust-blue hover:bg-trust-blue/90 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Writing Prompts */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-white">
            <h2 className="text-charcoal mb-4">Need inspiration? Try these prompts</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {journalPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptSelect(prompt)}
                  className={`p-3 text-left rounded-lg border transition-all hover:border-trust-blue hover:bg-trust-blue/5 ${
                    selectedPrompt === prompt 
                      ? 'border-trust-blue bg-trust-blue/5' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <PenTool className="h-4 w-4 text-trust-blue flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-charcoal">{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Mood History */}
        <section className="mb-8">
          <Card className="p-6 border-0 shadow-lg bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-charcoal">Your Mood Journey</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Avg: {getAverageMood()}/5 this week
              </div>
            </div>
            
            <div className="space-y-3">
              {moodHistory.map((day, index) => {
                const mood = moodOptions.find(m => m.value === day.mood);
                return (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-muted-foreground w-20">
                        {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{mood?.emoji}</span>
                        <span className="text-sm text-charcoal">{mood?.label}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {day.hasEntry && (
                        <div className="flex items-center gap-1 text-xs text-healing-green">
                          <PenTool className="h-3 w-3" />
                          Journal entry
                        </div>
                      )}
                      <div className={`w-3 h-3 rounded-full ${mood?.color}`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-center">
              <Button variant="outline" className="border-trust-blue text-trust-blue hover:bg-trust-blue/5">
                View Full History
              </Button>
            </div>
          </Card>
        </section>

        {/* Insights */}
        <section>
          <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-soft-purple/5 to-warm-coral/5">
            <div className="text-center">
              <Heart className="h-8 w-8 text-warm-coral mx-auto mb-3" />
              <h3 className="text-charcoal mb-2">Reflection Insights</h3>
              <p className="text-charcoal/70 text-sm mb-4">
                Regular journaling and mood tracking can help you identify patterns, process emotions, 
                and celebrate your growth. Remember, every feeling is valid and temporary.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-trust-blue/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-trust-blue" />
                  </div>
                  <h4 className="text-sm font-medium text-charcoal mb-1">Track Patterns</h4>
                  <p className="text-xs text-charcoal/70">
                    Notice what affects your mood and wellbeing
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-healing-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <PenTool className="h-6 w-6 text-healing-green" />
                  </div>
                  <h4 className="text-sm font-medium text-charcoal mb-1">Process Emotions</h4>
                  <p className="text-xs text-charcoal/70">
                    Writing helps organize thoughts and feelings
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-coral/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="h-6 w-6 text-warm-coral" />
                  </div>
                  <h4 className="text-sm font-medium text-charcoal mb-1">Celebrate Growth</h4>
                  <p className="text-xs text-charcoal/70">
                    See how far you've come on your journey
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <Navigation />
      </div>
    </div>
  );
}