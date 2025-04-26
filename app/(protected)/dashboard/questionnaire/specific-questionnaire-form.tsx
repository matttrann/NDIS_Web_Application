"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/shared/icons";
import { ConfettiCelebration } from "@/components/shared/confetti-celebration";

interface SpecificQuestionnaireAnswers {
  who: string;
  what: string;
  where: string;
  when: string;
  why: string;
}

export function SpecificQuestionnaireForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    who: "",
    what: "",
    where: "",
    when: "",
    why: ""
  });
  
  // Track validation errors
  const [validationError, setValidationError] = useState("");

  // Add state for celebration
  const [showCelebration, setShowCelebration] = useState(false);

  // Function to check if the current question has been answered
  const isCurrentQuestionAnswered = (): boolean => {
    switch (currentStep) {
      case 0: // who
        return !!answers.who.trim();
      case 1: // what
      return !!answers.what.trim();
      case 2: // where
      return !!answers.where.trim();
      case 3: // when
      return !!answers.when.trim();
      case 4: // why
      return !!answers.why.trim();
      default:
        return false;
    }
  };

  // Validate all questions before submitting
  const validateAllQuestions = (): boolean => {
    // Check each field
    const requiredFields = [
      { field: answers.who.trim(), name: "Who" },
      { field: answers.what.trim(), name: "what" },
      { field: answers.where.trim(), name: "where" },
      { field: answers.when.trim(), name: "when" },
      { field: answers.why.trim(), name: "why" }
    ];

    // Find first missing field
    const missingField = requiredFields.find(field => !field.field);
    
    if (missingField) {
      toast.error(`Please complete "${missingField.name}" before submitting.`);
      return false;
    }

    return true;
  };

  // Define all questions as components
  const questionComponents = [
    // Question 1: Who
    <>
      <h3 className="text-lg font-medium mb-4">Who does the situation involve?</h3>
      <Textarea
        value={answers.who}
        onChange={(e) => setAnswers({ ...answers, who: e.target.value })}
        placeholder="e.g. My teacher Ms. Green, My Father..."
        className="min-h-[100px]"
      />
    </>,

    // Question 2: What
    <>
    <h3 className="text-lg font-medium mb-4">What happens in the situation?</h3>
    <Textarea
      value={answers.what}
      onChange={(e) => setAnswers({ ...answers, what: e.target.value })}
      placeholder="e.g. I stop listening to the teachers"
      className="min-h-[100px]"
    />
  </>,

    // Question 3: Where
    <>
    <h3 className="text-lg font-medium mb-4">Where does the situation happen?</h3>
    <Textarea
      value={answers.where}
      onChange={(e) => setAnswers({ ...answers, where: e.target.value })}
      placeholder="e.g. In the classroom"
      className="min-h-[100px]"
    />
  </>,

    // Question 4: When
    <>
      <h3 className="text-lg font-medium mb-4">When does the situation happen?</h3>
      <Textarea
        value={answers.when}
        onChange={(e) => setAnswers({ ...answers, when: e.target.value })}
        placeholder="e.g. In maths class when Ms. Green is speaking"
        className="min-h-[100px]"
      />
    </>,

    // Question 5: Why
    <>
    <h3 className="text-lg font-medium mb-4">Why does the situation happen?</h3>
    <Textarea
      value={answers.why}
      onChange={(e) => setAnswers({ ...answers, why: e.target.value })}
      placeholder="e.g. I have too much energy"
      className="min-h-[100px]"
    />
  </>,
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllQuestions()) {
      return;
    }
    
    setLoading(true);

    try {
      const toastId = toast.loading("Submitting questionnaire...");
      
      const response = await fetch("/api/questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          answers,
        }),
      });

      if (response.ok) {
        // Trigger the confetti celebration
        setShowCelebration(true);
        
        // Stop the celebration after 5 seconds
        setTimeout(() => setShowCelebration(false), 5000);

        toast.success("Your questionnaire has been submitted successfully!", {
          id: toastId,
          duration: 5000,
        });
        router.refresh();
      } else {
        throw new Error(data?.error || "Failed to submit questionnaire");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.message || "Something went wrong. Please try again.", {
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const goNextStep = () => {
    // Validate current step before proceeding
    if (!isCurrentQuestionAnswered()) {
      setValidationError("Please answer this question before proceeding.");
      // Show error toast
      toast.error("Please answer this question before proceeding.");
      return;
    }
    
    setValidationError("");
    setCurrentStep(prev => Math.min(prev + 1, questionComponents.length - 1));
  };

  const goPrevStep = () => {
    setValidationError("");
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const totalSteps = questionComponents.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Clear validation error when answer changes
  useEffect(() => {
    if (validationError) {
      setValidationError("");
    }
  }, [answers]);

  return (
    <div className="rounded-lg border bg-card p-8">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentStep + 1} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Current question */}
        <div className="min-h-[200px] mb-6 animate-in fade-in-50 slide-in-from-right-5 duration-300">
          {questionComponents[currentStep]}
          
          {/* Show validation error message if any */}
          {validationError && (
            <p className="text-sm text-red-500 mt-2">{validationError}</p>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={goPrevStep}
            disabled={currentStep === 0}
            className="w-28"
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button 
              type="button" 
              onClick={goNextStep}
              className="w-28"
              disabled={!isCurrentQuestionAnswered()}
            >
              Next
              <Icons.chevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={loading || !isCurrentQuestionAnswered()}
              className="w-28"
            >
              {loading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  Submit
                  <Icons.check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Add the confetti celebration */}
      {showCelebration && <ConfettiCelebration duration={5000} />}
    </div>
  );
} 