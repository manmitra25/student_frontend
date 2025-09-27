import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentRunner, { AssessmentOption } from './AssessmentRunner';

const questions = [
  'Little interest or pleasure in doing things?',
  'Feeling down, depressed, or hopeless?',
  'Trouble falling or staying asleep, or sleeping too much?',
  'Feeling tired or having little energy?',
  'Poor appetite or overeating?',
  'Feeling bad about yourself — or that you are a failure?',
  'Trouble concentrating on things?',
  'Moving or speaking slowly or being fidgety/restless?',
  'Thoughts that you would be better off dead or of hurting yourself?',
];

const options: AssessmentOption[] = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

function interpretScore(score: number) {
  if (score <= 4) return { label: 'Minimal depression', message: 'Keep caring for yourself with sleep, movement, and connection.' };
  if (score <= 9) return { label: 'Mild depression', message: 'Small routines can help. Consider journaling or a walk today.' };
  if (score <= 14) return { label: 'Moderate depression', message: 'Talking to someone could help. You deserve support.' };
  if (score <= 19) return { label: 'Moderately severe depression', message: 'It may be time to seek professional help. You’re not alone.' };
  return { label: 'Severe depression', message: 'Please consider professional support soon. If in crisis, visit the Crisis page.' };
}

export default function DepressionTestPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <AssessmentRunner
      title="Are you Depressed"
      subtitle="PHQ‑9 based 9‑question check"
      questions={questions}
      options={options}
      interpretScore={interpretScore}
      type="depression"
      onBack={handleBack}
    />
  );
}



