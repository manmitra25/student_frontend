import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssessmentRunner, { AssessmentOption } from './AssessmentRunner';

const questions = [
  'Do you feel under pressure most of the time?',
  'Do you often feel overwhelmed by tasks?',
  'Do you have trouble sleeping due to worries?',
  'Do you notice tension in your body (neck, shoulders, jaw)?',
  'Do you struggle to take breaks even when tired?',
  'Do you find yourself more irritable than usual?',
  'Do you feel your stress affects your focus or mood?',
];

const options: AssessmentOption[] = [
  { label: 'Rarely', value: 0 },
  { label: 'Sometimes', value: 1 },
  { label: 'Often', value: 2 },
  { label: 'Very often', value: 3 },
];

function interpretScore(score: number) {
  if (score <= 4) return { label: 'Low stress', message: 'Great job balancing your load—keep it up!' };
  if (score <= 9) return { label: 'Mild stress', message: 'Try brief breathwork and small, regular pauses.' };
  if (score <= 14) return { label: 'Moderate stress', message: 'Consider planning buffer time and asking for support.' };
  return { label: 'High stress', message: 'Please prioritize rest and consider reaching out to support.' };
}

export default function StressTestPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <AssessmentRunner
      title="Are you Stressed"
      subtitle="7 quick questions"
      questions={questions}
      options={options}
      interpretScore={interpretScore}
      onBack={handleBack}
    />
  );
}



