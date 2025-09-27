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

  <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

   {/* Header */}

   <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">

    <div className="max-w-4xl mx-auto px-4 py-4">

     <div className="flex items-center justify-between text-foreground">

      <div className="flex items-center gap-3">

       <Link to="/dashboard">

        <Button variant="ghost" size="sm" className="rounded-full">

         <ArrowLeft className="h-4 w-4" />

        </Button>

       </Link>

       <div>

        <h1 className="text-xl font-semibold">Journal & Mood</h1>

        <p className="text-sm text-muted-foreground">Daily reflection and mood tracking</p>

       </div>

      </div>



      <div className="flex items-center gap-2">

       <Lock className="h-4 w-4 text-primary" />

       <span className="text-xs text-muted-foreground">Private & Encrypted</span>

      </div>

     </div>

    </div>

   </header>



   <main className="max-w-4xl mx-auto px-4 py-6 pb-24 space-y-8">

    <section className="grid gap-4 md:grid-cols-5">

     <Card className="p-6 col-span-3 bg-card border border-border/60 shadow-sm">

      <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>

      <div className="grid grid-cols-5 gap-3">

       {moodOptions.map((mood) => (

        <button

         key={mood.value}

         onClick={() => setSelectedMood(mood.value)}

         className={`p-4 rounded-xl border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${

          selectedMood === mood.value

           ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'

           : 'border-border bg-background/80 hover:border-muted hover:bg-muted/40'

         }`}

        >

         <div className="text-3xl mb-2">{mood.emoji}</div>

         <div className="text-sm font-medium">{mood.label}</div>

        </button>

       ))}

      </div>

      {selectedMood && (

       <p className="mt-4 text-sm text-muted-foreground text-center">

        Thank you for sharing. Tracking your mood helps reveal patterns over time.

       </p>

      )}

     </Card>



     <Card className="p-6 col-span-2 bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border/60 shadow-sm">

      <div className="flex items-start justify-between mb-3">

       <div>

        <p className="text-xs uppercase tracking-wide text-muted-foreground">Today is</p>

        <h2 className="text-xl font-semibold text-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'long' })}</h2>

        <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</p>

       </div>

       <Smile className="h-6 w-6 text-primary" />

      </div>

      <div className="rounded-xl bg-card/80 border border-border/50 p-4 space-y-2 text-sm">

       <p className="font-medium text-foreground">Guided reflection</p>

       <p className="text-muted-foreground">

        {selectedMood ? 'Notice one small thing that influenced your mood today.' : 'Select a mood to unlock quick prompts tailored for you.'}

       </p>

      </div>

     </Card>

    </section>



    {/* Journal Entry */}

    <section>

     <Card className="p-6 bg-card border border-border/60 shadow-sm">

      <div className="flex items-center justify-between mb-4 text-foreground">

       <h2 className="text-lg font-semibold">Today's Journal Entry</h2>

       <div className="flex items-center gap-2">

        <Calendar className="h-4 w-4 text-muted-foreground" />

        <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>

       </div>

      </div>



      <div className="space-y-4">

       <Textarea

        value={journalEntry}

        onChange={(e) => setJournalEntry(e.target.value)}

        placeholder="What's on your mind today? Share your thoughts, feelings, experiences, or anything you'd like to reflect on. This space is completely private and just for you."

        className="min-h-[220px] border-border focus-visible:ring-2 focus-visible:ring-primary/40 resize-none bg-background/90 text-foreground"

       />



       <div className="flex flex-wrap items-center justify-between gap-3">

        <p className="text-xs text-muted-foreground flex items-center gap-1">

         <Lock className="h-3 w-3" />

         Your entries are encrypted and private

        </p>

        <div className="flex items-center gap-2">

         {isSaved && (

          <span className="text-sm text-primary flex items-center gap-1">

           <div className="w-2 h-2 bg-primary rounded-full"></div>

           Saved

          </span>

         )}

         <Button

          onClick={handleSaveEntry}

          disabled={!selectedMood || !journalEntry.trim()}

          className="px-5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"

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

    <section>

     <Card className="p-6 bg-card border border-border/60 shadow-sm">

      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">

       <h2 className="text-lg font-semibold">Need inspiration? Try these prompts</h2>

       <Button

        variant="ghost"

        size="sm"

        className="rounded-full hover:bg-muted/40"

        onClick={() => handlePromptSelect(journalPrompts[Math.floor(Math.random() * journalPrompts.length)])}

       >

        Surprise me

       </Button>

      </div>

      <div className="grid md:grid-cols-2 gap-3">

       {journalPrompts.map((prompt, index) => (

        <button

         key={index}

         onClick={() => handlePromptSelect(prompt)}

         className={`p-3 text-left rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${

          selectedPrompt === prompt

           ? 'border-primary bg-primary/10 shadow'

           : 'border-border hover:border-muted hover:bg-muted/30'

         }`}

        >

         <div className="flex items-start gap-2">

          <PenTool className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />

          <span className="text-sm text-foreground/90">{prompt}</span>

         </div>

        </button>

       ))}

      </div>

     </Card>

    </section>



    {/* Mood History */}

    <section>

     <Card className="p-6 bg-card border border-border/60 shadow-sm">

      <div className="flex items-center justify-between mb-4">

       <h2 className="text-lg font-semibold">Your Mood Journey</h2>

       <div className="flex items-center gap-2 text-sm text-muted-foreground">

        <TrendingUp className="h-4 w-4" />

        Avg: {getAverageMood()}/5 this week

       </div>

      </div>



      <div className="space-y-3">

       {moodHistory.map((day, index) => {

        const mood = moodOptions.find(m => m.value === day.mood);

        return (

         <div key={index} className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-muted/40 border border-border/50">

          <div className="flex items-center gap-3">

           <div className="text-sm text-muted-foreground min-w-[4.5rem]">

            {new Date(day.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}

           </div>

           <div className="flex items-center gap-2">

            <span className="text-lg">{mood?.emoji}</span>

            <span className="text-sm text-foreground">{mood?.label}</span>

           </div>

          </div>



          <div className="flex items-center gap-3 text-xs">

           {day.hasEntry && (

            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">

             <PenTool className="h-3 w-3" />

             journal entry

            </span>

           )}

           <div className={`w-2.5 h-2.5 rounded-full ${mood?.color || 'bg-primary'}`} />

          </div>

         </div>

        );

       })}

      </div>



      <div className="mt-6 text-center">

       <Button variant="outline" className="rounded-full border-border text-foreground hover:bg-muted/40">

        View Full History

       </Button>

      </div>

     </Card>

    </section>



    {/* Insights */}

    <section>

     <Card className="p-6 bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border/60 shadow-sm">

      <div className="text-center text-foreground">

       <Heart className="h-8 w-8 text-secondary mx-auto mb-3" />

       <h3 className="text-lg font-semibold mb-2">Reflection Insights</h3>

       <p className="text-sm text-foreground/80 mb-4">

        Regular journaling and mood tracking help you notice patterns, process emotions, and celebrate your growth.

       </p>



       <div className="grid md:grid-cols-3 gap-4 mt-6">

        {[{

         icon: <TrendingUp className="h-6 w-6 text-primary" />,

         title: 'Track Patterns',

         copy: 'Spot the rhythms that shape your wellbeing'

        }, {

         icon: <PenTool className="h-6 w-6 text-secondary" />,

         title: 'Process Emotions',

         copy: 'Give thoughts and feelings a gentle home'

        }, {

         icon: <Heart className="h-6 w-6 text-accent" />,

         title: 'Celebrate Growth',

         copy: 'Notice the small wins along your path'

        }].map((item, idx) => (

         <div key={idx} className="rounded-xl bg-card/80 border border-border/50 p-4 text-center space-y-2">

          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">

           {item.icon}

          </div>

          <h4 className="text-sm font-medium">{item.title}</h4>

          <p className="text-xs text-muted-foreground">{item.copy}</p>

         </div>

        ))}

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



