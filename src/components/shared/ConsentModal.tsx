import { useState } from 'react';

import { Button } from '../ui/button';

import { Card } from '../ui/card';

import { Shield, Info, X } from 'lucide-react';



interface ConsentModalProps {

 isOpen: boolean;

 onClose: () => void;

 onConsent: (allowed: boolean) => void;

}



export default function ConsentModal({ isOpen, onClose, onConsent }: ConsentModalProps) {

 if (!isOpen) return null;



 const handleConsent = (allowed: boolean) => {

  onConsent(allowed);

  onClose();

 };



 return (

  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

   <Card className="max-w-md w-full p-6 border-0 shadow-2xl">

    <div className="flex items-center justify-between mb-4">

     <div className="flex items-center space-x-2">

      <Shield className="h-5 w-5 text-primary" />

      <h2 className="text-lg font-semibold text-foreground">Privacy Choice</h2>

     </div>

     <Button variant="ghost" size="sm" onClick={onClose}>

      <X className="h-4 w-4" />

     </Button>

    </div>



    <div className="space-y-4">

     <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">

      <div className="flex items-start space-x-3">

       <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />

       <div>

        <p className="text-sm text-blue-800 font-medium mb-2">

         Help us provide better support

        </p>

        <p className="text-sm text-blue-700 leading-relaxed">

         Do you allow ManMitra to keep a short summary of this chat? This summary may be shared with your counsellor if you book a session.

        </p>

       </div>

      </div>

     </div>



     <div className="space-y-3">

      <div className="p-3 bg-muted/30 rounded-lg">

       <p className="text-sm text-foreground font-medium mb-1">✅ What we keep:</p>

       <p className="text-xs text-muted-foreground">Brief summary of topics discussed and general mood</p>

      </div>

       

      <div className="p-3 bg-muted/30 rounded-lg">

       <p className="text-sm text-foreground font-medium mb-1">🔒 What we don't keep:</p>

       <p className="text-xs text-muted-foreground">Your full conversation history or personal details</p>

      </div>

     </div>



     <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg">

      <p><strong>Important:</strong> You can change this preference anytime in Settings → Privacy. This choice only affects future conversations.</p>

     </div>

    </div>



    <div className="flex space-x-3 mt-6">

     <Button

      onClick={() => handleConsent(false)}

      variant="outline"

      className="flex-1"

     >

      Don't Allow

     </Button>

     <Button

      onClick={() => handleConsent(true)}

      className="flex-1 bg-primary hover:bg-primary/90"

     >

      Allow Summaries

     </Button>

    </div>

   </Card>

  </div>

 );

}