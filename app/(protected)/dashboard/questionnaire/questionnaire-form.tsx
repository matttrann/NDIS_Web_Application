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
import "@/styles/globals.css";  
import "@/styles/avatar-pic/Sport_Kangaroo.png";


interface QuestionnaireAnswers {
  whoisInvolved: string;
  whoCanHelp: string;
  situation: string;
  when: string;
  where: string;
  why: string;
  whatStrategyHelps: string;
  storyFeel: string;
  whatStoryShow: string;
}

export function QuestionnaireForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    whoisInvolved: "",
    whoCanHelp: "",
    situation: "",
    when: "",
    where: "",
    why: "",
    whatStrategyHelps: "",
    storyFeel: "",
    whatStoryShow: ""
  });
  
  // Track validation errors
  const [validationError, setValidationError] = useState("");

  // Add state for celebration
  const [showCelebration, setShowCelebration] = useState(false);

  // Function to check if the current question has been answered
  const isCurrentQuestionAnswered = (): boolean => {
    switch (currentStep) {
      case 0: //  who is Involved
        return !!answers.whoisInvolved.trim();
      case 1: // Who can help
        return !!answers.whoCanHelp.trim();
      case 2: // what is the situation
        return !!answers.situation.trim();
      case 3: // when does it happen
        return !!answers.when.trim();
      case 4: // where does it happen
        return !!answers.where.trim();
      case 5: // Why is the situation difficult
        return !!answers.why.trim();
      case 6: // What strategy helps
        return !!answers.whatStrategyHelps.trim();
      case 7: // Strengths
        return !!answers.storyFeel;
      case 8: // Communication Preferences
        return !!answers.whatStoryShow.trim();
      default:
        return false;
    }
  };

  // Validate all questions before submitting
  const validateAllQuestions = (): boolean => {
    // Check each field
    const requiredFields = [
      { field: answers.whoisInvolved.trim(), name: "who is involved" },
      { field: answers.whoCanHelp.trim(), name: "Who can help" },
      { field: answers.situation.trim(), name: "What is the situation" },
      { field: answers.where.trim(), name: "What makes you upset" },
      { field: answers.why.trim(), name: "Why it's hard" },
      { field: answers.whatStrategyHelps.trim(), name: "what Strategy Helps" },
      { field: answers.storyFeel, name: "How you're feeling" },
      { field: answers.whatStoryShow.trim(), name: "What the story should show" }
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
    // Question 1: 1.	WHO is involved within this story?
    <>
      <h3 className="text-lg font-medium mb-4"><span className='rcorners2'>Who are the people (or maybe even animals!) in the story?
      </span><img src="styles/avatar-pic/Sport_Kangaroo.png" style={{ width: '150px' }}/></h3>
      <Textarea
        value={answers.whoisInvolved}
        onChange={(e) => setAnswers({ ...answers, whoisInvolved: e.target.value })}
        placeholder="e.g., My mother, my friend Sarah, etc."
        className="min-h-[100px]"
      />
    </>,

    // Question 2: WHO can you trust to help you through a tough situation?
    <>
      <h3 className="text-lg font-medium mb-4">WHO can you trust to help you through a tough situation?</h3>
      <Textarea
        value={answers.whoCanHelp}
        onChange={(e) => setAnswers({ ...answers, whoCanHelp: e.target.value })}
        placeholder="e.g., My mother, my friend Sarah, etc."
        className="min-h-[100px]"
      />
    </>,

    // Question 3: WHAT is the situation or challenge in your story? 
    <>
    <h3 className="text-lg font-medium mb-4">WHAT is the situation or challenge in your story?</h3>
    <Textarea
      value={answers.situation}
      onChange={(e) => setAnswers({ ...answers, situation: e.target.value })}
      placeholder="e.g. I have too much energy and fidget"
      className="min-h-[100px]"
    />
  </>,

  // Question 4: WHEN does this situation occur?
  <>
  <h3 className="text-lg font-medium mb-4">WHEN does this situation occur?</h3>
  <Textarea
    value={answers.when}
    onChange={(e) => setAnswers({ ...answers, when: e.target.value })}
    placeholder="e.g., During story time"
    className="min-h-[100px]"
  />
</>,

    // Question 5: WHERE does it happen? 
    <>
    <h3 className="text-lg font-medium mb-4">WHERE does it happen? </h3>
    <Textarea
      value={answers.where}
      onChange={(e) => setAnswers({ ...answers, where: e.target.value })}
      placeholder="e.g., in maths class"
      className="min-h-[100px]"
    />
  </>,

    // Question 6: WHY is this situation hard for you? 
    <>
      <h3 className="text-lg font-medium mb-4">WHY is this situation hard for you?</h3>
      <Textarea
        value={answers.why}
        onChange={(e) => setAnswers({ ...answers, why: e.target.value })}
        placeholder="e.g. I have too much energy"
        className="min-h-[100px]"
      />
    </>,

    // Question 7: WHAT strategy could help you feel better in this situation? 
    <>
      <h3 className="text-lg font-medium mb-4">WHAT strategy could help you feel better in this situation?</h3>
      <Input
        value={answers.whatStrategyHelps}
        onChange={(e) => setAnswers({ ...answers, whatStrategyHelps: e.target.value })}
        placeholder="e.g., Making friends, managing emotions, completing tasks independently"
      />
    </>,

    // Question 8: HOW do you want the story to feel? 
    <>
      <h3 className="text-lg font-medium mb-4">HOW do you want the story to feel?</h3>
      <Select 
        onValueChange={(value) => setAnswers({ ...answers, storyFeel: value })}
        value={answers.storyFeel}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your mood" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Calming"> Calming</SelectItem>
          <SelectItem value="Reassuring"> Reassuring</SelectItem>
          <SelectItem value="Encouraging"> Encouraging</SelectItem>
          <SelectItem value="Funny"> Funny</SelectItem>
          <SelectItem value="Adventurous"> Adventurous</SelectItem>
        </SelectContent>
      </Select>
    </>,

    // Question 9: WHAT do you want the story to teach or show? 
    <>
      <h3 className="text-lg font-medium mb-4">WHAT do you want the story to teach or show? </h3>
      <Input
        value={answers.whatStoryShow}
        onChange={(e) => setAnswers({ ...answers, whatStoryShow: e.target.value })}
        placeholder="e.g., my strategies clearly listed, a character using my strategies"
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
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to submit questionnaire");
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