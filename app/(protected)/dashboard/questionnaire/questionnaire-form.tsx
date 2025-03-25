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

interface QuestionnaireAnswers {
  emotionalState: string;
  energyLevel: number;
  dailyChallenges: string;
  supportNeeds: string[];
  socialComfort: number;
  triggers: string[];
  calmingStrategies: string;
  goals: string;
  strengths: string;
  communicationPreferences: string;
  learningStyle: string;
  sensorySensitivities: string[];
  interests: string;
  storyCharacter: string;
  storyTone: string;
  videoPreferences: string;
  supportNetwork: string;
  independenceGoals: string;
}

export function QuestionnaireForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    emotionalState: "",
    energyLevel: 5,
    dailyChallenges: "",
    supportNeeds: [],
    socialComfort: 5,
    triggers: [],
    calmingStrategies: "",
    goals: "",
    strengths: "",
    communicationPreferences: "",
    learningStyle: "",
    sensorySensitivities: [],
    interests: "",
    storyCharacter: "",
    storyTone: "",
    videoPreferences: "",
    supportNetwork: "",
    independenceGoals: ""
  });
  
  // Track validation errors
  const [validationError, setValidationError] = useState("");

  // Add state for celebration
  const [showCelebration, setShowCelebration] = useState(false);

  // Function to check if the current question has been answered
  const isCurrentQuestionAnswered = (): boolean => {
    switch (currentStep) {
      case 0: // Emotional State
        return !!answers.emotionalState;
      case 1: // Energy Level
        return true; // Slider already has a default value
      case 2: // Daily Challenges
        return !!answers.dailyChallenges.trim();
      case 3: // Support Needs
        return answers.supportNeeds.length > 0;
      case 4: // Social Comfort
        return true; // Slider already has a default value
      case 5: // Triggers
        return answers.triggers.length > 0;
      case 6: // Calming Strategies
        return !!answers.calmingStrategies.trim();
      case 7: // Goals
        return !!answers.goals.trim();
      case 8: // Strengths
        return !!answers.strengths.trim();
      case 9: // Communication Preferences
        return !!answers.communicationPreferences;
      case 10: // Learning Style
        return !!answers.learningStyle;
      case 11: // Sensory Sensitivities
        return answers.sensorySensitivities.length > 0;
      case 12: // Interests
        return !!answers.interests.trim();
      case 13: // Story Character
        return !!answers.storyCharacter;
      case 14: // Story Tone
        return !!answers.storyTone;
      case 15: // Support Network
        return !!answers.supportNetwork;
      case 16: // Independence Goals
        return !!answers.independenceGoals.trim();
      default:
        return false;
    }
  };

  // Validate all questions before submitting
  const validateAllQuestions = (): boolean => {
    // Check each field
    const requiredFields = [
      { field: answers.emotionalState, name: "How you're feeling" },
      { field: answers.dailyChallenges.trim(), name: "Daily challenges" },
      { field: answers.supportNeeds.length > 0, name: "Support needs" },
      { field: answers.triggers.length > 0, name: "What makes you upset" },
      { field: answers.calmingStrategies.trim(), name: "Calming strategies" },
      { field: answers.goals.trim(), name: "Goals" },
      { field: answers.strengths.trim(), name: "Strengths" },
      { field: answers.communicationPreferences, name: "Communication preferences" },
      { field: answers.learningStyle, name: "Learning style" },
      { field: answers.sensorySensitivities.length > 0, name: "Sensory sensitivities" },
      { field: answers.interests.trim(), name: "Interests" },
      { field: answers.storyCharacter, name: "Story character" },
      { field: answers.storyTone, name: "Story tone" },
      { field: answers.supportNetwork, name: "Support network" },
      { field: answers.independenceGoals.trim(), name: "Independence goals" }
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
    // Question 1: Emotional State
    <>
      <h3 className="text-lg font-medium mb-4">How are you feeling today?</h3>
      <Select 
        onValueChange={(value) => setAnswers({ ...answers, emotionalState: value })}
        value={answers.emotionalState}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your mood" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="😊 Happy">😊 Happy</SelectItem>
          <SelectItem value="😐 Neutral">😐 Neutral</SelectItem>
          <SelectItem value="😞 Sad">😞 Sad</SelectItem>
          <SelectItem value="😰 Anxious">😰 Anxious</SelectItem>
          <SelectItem value="😡 Angry">�� Angry</SelectItem>
          <SelectItem value="💤 Tired">💤 Tired</SelectItem>
        </SelectContent>
      </Select>
    </>,

    // Question 2: Energy Level
    <>
      <h3 className="text-lg font-medium mb-4">Rate your energy today:</h3>
      <div className="flex items-center gap-4">
        <span>Low Energy 1</span>
        <Slider
          value={[answers.energyLevel]}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => setAnswers({ ...answers, energyLevel: value[0] })}
          className="flex-1"
        />
        <span>10 High Energy</span>
      </div>
      <div className="text-center mt-2 text-muted-foreground text-sm">
        Your Energy Level: {answers.energyLevel}
      </div>
    </>,

    // Question 3: Daily Challenges
    <>
      <h3 className="text-lg font-medium mb-4">What's been the hardest part of your day/week?</h3>
      <Textarea
        value={answers.dailyChallenges}
        onChange={(e) => setAnswers({ ...answers, dailyChallenges: e.target.value })}
        placeholder="e.g., Transitions, social interactions, sensory overload, routines"
        className="min-h-[100px]"
      />
    </>,

    // Question 4: Support Needs
    <>
      <h3 className="text-lg font-medium mb-4">What tasks or activities do you need help with most?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Self-care', 'Communication', 'Mobility', 'Emotional regulation', 'Learning'].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={option}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              value={option}
              checked={answers.supportNeeds.includes(option)}
              onChange={(e) => {
                const newSupportNeeds = e.target.checked
                  ? [...answers.supportNeeds, option]
                  : answers.supportNeeds.filter((item: string) => item !== option);
                setAnswers({ ...answers, supportNeeds: newSupportNeeds });
              }}
            />
            <label htmlFor={option} className="text-sm font-medium text-gray-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option}</label>
          </div>
        ))}
      </div>
    </>,

    // Question 5: Social Comfort
    <>
      <h3 className="text-lg font-medium mb-4">How comfortable do you feel interacting with others?</h3>
      <div className="flex items-center gap-4">
        <span>Very Uncomfortable 1</span>
        <Slider
          value={[answers.socialComfort]}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => setAnswers({ ...answers, socialComfort: value[0] })}
          className="flex-1"
        />
        <span>10 Very Comfortable</span>
      </div>
      <div className="text-center mt-2 text-muted-foreground text-sm">
        Your Social Comfort: {answers.socialComfort}
      </div>
    </>,

    // Question 6: Triggers
    <>
      <h3 className="text-lg font-medium mb-4">What usually makes you feel upset or overwhelmed?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Loud noises', 'Changes in plans', 'Criticism', 'Crowded spaces'].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={option}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              value={option}
              checked={answers.triggers.includes(option)}
              onChange={(e) => {
                const newTriggers = e.target.checked
                  ? [...answers.triggers, option]
                  : answers.triggers.filter((item: string) => item !== option);
                setAnswers({ ...answers, triggers: newTriggers });
              }}
            />
            <label htmlFor={option} className="text-sm font-medium text-gray-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option}</label>
          </div>
        ))}
      </div>
    </>,

    // Question 7: Calming Strategies
    <>
      <h3 className="text-lg font-medium mb-4">What helps you feel calm when you're stressed?</h3>
      <Textarea
        value={answers.calmingStrategies}
        onChange={(e) => setAnswers({ ...answers, calmingStrategies: e.target.value })}
        placeholder="e.g., Deep breathing, quiet time, music, fidget tools"
        className="min-h-[100px]"
      />
    </>,

    // Question 8: Goals
    <>
      <h3 className="text-lg font-medium mb-4">What's one thing you'd like to get better at?</h3>
      <Input
        value={answers.goals}
        onChange={(e) => setAnswers({ ...answers, goals: e.target.value })}
        placeholder="e.g., Making friends, managing emotions, completing tasks independently"
      />
    </>,

    // Question 9: Strengths
    <>
      <h3 className="text-lg font-medium mb-4">What are you really good at or proud of?</h3>
      <Textarea
        value={answers.strengths}
        onChange={(e) => setAnswers({ ...answers, strengths: e.target.value })}
        className="min-h-[100px]"
      />
    </>,

    // Question 10: Communication Preferences
    <>
      <h3 className="text-lg font-medium mb-4">How do you prefer to communicate?</h3>
      <Select 
        onValueChange={(value) => setAnswers({ ...answers, communicationPreferences: value })}
        value={answers.communicationPreferences}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your preference" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Talking">Talking</SelectItem>
          <SelectItem value="Typing">Typing</SelectItem>
          <SelectItem value="Symbols/AAC">Symbols</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>
    </>,

    // Question 11: Learning Style
    <>
      <h3 className="text-lg font-medium mb-4">How do you learn best?</h3>
      <Select 
        onValueChange={(value) => setAnswers({ ...answers, learningStyle: value })}
        value={answers.learningStyle}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your learning style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Watching videos">Watching videos</SelectItem>
          <SelectItem value="Listening">Listening</SelectItem>
          <SelectItem value="Reading">Reading</SelectItem>
        </SelectContent>
      </Select>
    </>,

    // Question 12: Sensory Sensitivities
    <>
      <h3 className="text-lg font-medium mb-4">Do any of these bother you?</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {['Bright lights', 'Loud sounds', 'Certain textures', 'Strong smells'].map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={option}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              value={option}
              checked={answers.sensorySensitivities.includes(option)}
              onChange={(e) => {
                const newSensitivities = e.target.checked
                  ? [...answers.sensorySensitivities, option]
                  : answers.sensorySensitivities.filter((item: string) => item !== option);
                setAnswers({ ...answers, sensorySensitivities: newSensitivities });
              }}
            />
            <label htmlFor={option} className="text-sm font-medium text-gray-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{option}</label>
          </div>
        ))}
      </div>
    </>,

    // Question 13: Interests
    <>
      <h3 className="text-lg font-medium mb-4">What do you love doing or learning about?</h3>
      <Textarea
        value={answers.interests}
        onChange={(e) => setAnswers({ ...answers, interests: e.target.value })}
        className="min-h-[100px]"
      />
    </>,

    // Question 14: Story Character
    <>
      <h3 className="text-lg font-medium mb-4">Who should the main character in your story be?</h3>
      <Select 
        onValueChange={(value) => setAnswers({ ...answers, storyCharacter: value })}
        value={answers.storyCharacter}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select character type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Someone like me">Someone like me</SelectItem>
          <SelectItem value="An animal">An animal</SelectItem>
          <SelectItem value="A superhero">A superhero</SelectItem>
          <SelectItem value="A fictional character">A fictional character</SelectItem>
        </SelectContent>
      </Select>
    </>,

    // Question 15: Story Tone
    <>
      <h3 className="text-lg font-medium mb-4">What kind of story do you want?</h3>
      <Select 
        onValueChange={(value) => setAnswers({ ...answers, storyTone: value })}
        value={answers.storyTone}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select story tone" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Funny">Funny</SelectItem>
          <SelectItem value="Adventurous">Adventurous</SelectItem>
          <SelectItem value="Calming">Calming</SelectItem>
          <SelectItem value="Educational">Educational</SelectItem>
          <SelectItem value="Fantasy">Fantasy</SelectItem>
        </SelectContent>
      </Select>
    </>,

    // Question 16: Support Network
    <>
      <h3 className="text-lg font-medium mb-4">Who helps you most often?</h3>
      <Select 
        onValueChange={(value) => setAnswers({ ...answers, supportNetwork: value })}
        value={answers.supportNetwork}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select support source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Family">Family</SelectItem>
          <SelectItem value="Therapist">Therapist</SelectItem>
          <SelectItem value="Support worker">Support worker</SelectItem>
          <SelectItem value="Friends">Friends</SelectItem>
          <SelectItem value="No one">No one</SelectItem>
        </SelectContent>
      </Select>
    </>,

    // Question 17: Independence Goals
    <>
      <h3 className="text-lg font-medium mb-4">What's one thing you'd like to try doing on your own?</h3>
      <Input
        value={answers.independenceGoals}
        onChange={(e) => setAnswers({ ...answers, independenceGoals: e.target.value })}
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