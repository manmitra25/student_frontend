import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentRunner, { AssessmentOption } from './AssessmentRunner';

const questions = [
  'Feeling nervous, anxious, or on edge?',
  'Not being able to stop or control worrying?',
  'Worrying too much about different things?',
  'Trouble relaxing?',
  'Being so restless that it is hard to sit still?',
  'Becoming easily annoyed or irritable?',
  'Feeling afraid as if something awful might happen?',
];

const options: AssessmentOption[] = [
  { label: 'Not at all', value: 0 },
  { label: 'Several days', value: 1 },
  { label: 'More than half the days', value: 2 },
  { label: 'Nearly every day', value: 3 },
];

function interpretScore(score: number) {
  if (score <= 4) return { label: 'Minimal anxiety', message: 'You seem to be doing okay. Keep using healthy habits and reach out if needed.' };
  if (score <= 9) return { label: 'Mild anxiety', message: 'Consider gentle coping strategies like deep breathing and short walks.' };
  if (score <= 14) return { label: 'Moderate anxiety', message: 'It may help to talk to someone you trust or a counselor.' };
  return { label: 'Severe anxiety', message: 'Professional support can help. You’re not alone and support is available.' };
}

export default function AnxietyTestPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <AssessmentRunner
      title="Are you Anxious"
      subtitle="A quick 7‑question check"
      questions={questions}
      options={options}
      interpretScore={interpretScore}
      type="anxiety"
      onBack={handleBack}
    />
  );
}



