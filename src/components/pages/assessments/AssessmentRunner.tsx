import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "../../ui/card";

import { Button } from "../../ui/button";

import { Progress } from "../../ui/progress";

import { saveTestResult } from "../../../api/services/tests";

import { ArrowLeft } from "lucide-react";

export interface AssessmentOption {
  label: string;

  value: number;
}

export interface AssessmentRunnerProps {
  title: string;
  subtitle?: string;
  questions: string[];
  options: AssessmentOption[];
  interpretScore: (score: number) => { label: string; message: string };
  type: "stress" | "depression" | "anxiety" | "burnout";  // NEW
  onBack?: () => void;
}


export default function AssessmentRunner({
  title,
  subtitle,
  questions,
  options,
  interpretScore,
  type,
  onBack,
}: AssessmentRunnerProps) {
  const [index, setIndex] = useState(0);

  const [answers, setAnswers] = useState<number[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  const total = questions.length;

  const progress = useMemo(() => (index / total) * 100, [index, total]);

  const onSelect = (val: number) => {
    const nextAnswers = [...answers];

    nextAnswers[index] = val;

    setAnswers(nextAnswers);

    if (index < total - 1) {
      setIndex(index + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (index > 0) setIndex(index - 1);
  };

  const isComplete =
    answers.length === total && answers.every((a) => a !== undefined);

  const score = useMemo(
    () => answers.reduce((a, b) => a + (b || 0), 0),
    [answers]
  );

  const result = isComplete ? interpretScore(score) : null;

  const handleSubmit = async () => {
  if (!isComplete) return;

  try {

    console.log("Submitting test:", { type, score });
    const res = await saveTestResult(type, { score });
    console.log("Backend response:", res);

    setSubmitted(true);

    // Navigate back after successful submission
    if (onBack) {
      onBack();
    } else {
      navigate(-1); // Go back to previous page
    }
  } catch (error) {
    console.error("Error saving test result:", error);
  }
};


  // useEffect(() => {
  //   if (isComplete) {
  //     // detect which test it is (stress, depression, etc.)

  //     const type = title.toLowerCase() as
  //       | "stress"
  //       | "depression"
  //       | "anxiety"
  //       | "burnout";

  //     saveTestResult(type, { score })
  //       .then((res) => console.log("Saved result:", res))

  //       .catch((err) => console.error("Error saving result:", err));
  //   }
  // }, [isComplete, score, title]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Back button */}
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack || (() => navigate(-1))}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>

        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <Progress value={isComplete ? 100 : progress} />

      <div className="text-xs text-muted-foreground text-center">
        {isComplete ? "Completed" : `Question ${index + 1} of ${total}`}
      </div>

      {!isComplete ? (
        <Card className="p-5 border-0 shadow-sm">
          <div className="space-y-4">
            <div className="bg-muted/40 rounded-2xl p-4">
              <p className="text-sm leading-relaxed">{questions[index]}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {options.map((opt) => (
                <Button
                  key={opt.label}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => onSelect(opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousQuestion}
                disabled={index === 0}
              >
                Back
              </Button>

              <div className="text-xs text-muted-foreground">
                Your selections are private
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-6 border-0 shadow-sm">
          <div className="space-y-3 text-center">
            <div className="text-sm text-muted-foreground">Total score</div>

            <div className="text-3xl font-semibold text-foreground">
              {score}
            </div>

            <div className="text-lg font-medium">{result?.label}</div>

            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {result?.message}
            </p>

            <div className="pt-2">
              <Button onClick={handleSubmit} disabled={submitted}>
                {submitted ? "Submitted" : "Submit"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
