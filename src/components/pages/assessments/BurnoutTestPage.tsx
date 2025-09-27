import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentRunner, { AssessmentOption } from './AssessmentRunner';

const questions = [
  'Do you feel emotionally exhausted by your work/studies?',
  'Do you feel detached or cynical about tasks you used to enjoy?',
  'Do you find it hard to concentrate or stay motivated?',
  'Are you noticing reduced performance despite effort?',
  'Do you feel physically tired or drained most days?',
  'Do you feel irritable or overly sensitive lately?',
  'Do you feel overwhelmed by responsibilities?',
];

const options: AssessmentOption[] = [
  { label: 'Never', value: 0 },
  { label: 'Sometimes', value: 1 },
  { label: 'Often', value: 2 },
  { label: 'Almost always', value: 3 },
];

function interpretScore(score: number) {
  if (score <= 4) return { label: 'Low burnout risk', message: 'Keep balancing rest, movement, and connection.' };
  if (score <= 9) return { label: 'Mild burnout risk', message: 'Consider micro‑breaks and realistic planning.' };
  if (score <= 14) return { label: 'Moderate burnout risk', message: 'It may help to reduce load and seek support.' };
  return { label: 'High burnout risk', message: 'Please prioritize rest and consider professional guidance.' };
}

export default function BurnoutTestPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <AssessmentRunner
      title="Burnout"
      subtitle="7 quick questions"
      questions={questions}
      options={options}
      interpretScore={interpretScore}
      type="burnout"
      onBack={handleBack}
    />
  );
}



