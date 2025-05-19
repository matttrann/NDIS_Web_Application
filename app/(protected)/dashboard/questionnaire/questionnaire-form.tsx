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
import "@/styles/UI.css";
import "@/styles/button.css";
import "@/styles/bird.css";
import "@/styles/loadingBar.css";
import Image from 'next/image'
import { gsap } from "gsap";




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
      case 0: // Welcome screen
        return true; // No answer required for the welcome screen
      case 1: //  who is Involved
        return !!answers.whoisInvolved.trim();
      case 2: // Who can help
        return !!answers.whoCanHelp.trim();
      case 3: // what is the situation
        return !!answers.situation.trim();
      case 4: // when does it happen?
        return !!answers.when.trim();
      case 5: // where does it happen?
        return !!answers.where.trim();
      case 6: // Why is the situation difficult?
        return !!answers.why.trim();
      case 7: // What strategy helps
        return !!answers.whatStrategyHelps.trim();
      case 8: // Strengths
        return !!answers.storyFeel.trim();
      case 9: // Communication Preferences
        return !!answers.whatStoryShow.trim();
      case 10: // Finishing screen
        return true; // No answer required for the last step
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

    // Find the first missing field
    const missingField = requiredFields.find(field => !field.field);
    
    if (missingField) {
      toast.error(`Please complete "${missingField.name}" before submitting.`);
      return false;
    }

    return true;
  };

  const questions = [
    "Hello! I'm here to help you with your story. Let's get started!",
    "WHO are the people (or maybe even animals!) in this situation?",
    "WHO can you trust to help you through this tough situation?",
    "WHAT were the people (or animals doing)? What was happening around them?",
    "WHEN this situation takes place. Is it a long time ago, in the morning, or at night?",
    "WHERE is this situation taking place? Is it at home, at school, in a park, or somewhere else?",
    "WHY is this situation hard for you?",
    "WHAT strategies could help you feel better in this situation?",
    "HOW do you want the story to feel?",
    "WHAT do you want the story to teach or show?",
    "Well Done! Thank you for answering my questions"
  ];

  function getRandomColor() {
    // Generate a random number between 0 and 0xffffff (16777215).
    const randomValue = Math.random() * 0xffffff;
  
    // Convert the random number to an integer (base 10).
    const integerValue = Math.floor(randomValue);
  
    // Convert the integer to a hexadecimal string.
    const hexString = integerValue.toString(16);
  
    // Pad the hexadecimal string with leading zeros if necessary to ensure it's 6 characters long.
    const paddedHexString = hexString.padStart(6, '0');
  
    // Prepend the '#' character to form a valid CSS color string.
    const color = '#' + paddedHexString;
  
    return color;
  }

  const loadingBarStyle = [
    "bar shadow overlap",
    "bar shadow leaf",
    "bar shadow bars",
    "bar shadow lines",
    "bar shadow wiggle",
    "bar shadow dots",
    "bar shadow circuit",
    "bar shadow aztec",
    "bar shadow bees",
    "bar shadow food",
    "bar shadow clouds",
    "bar shadow stripes",
    "bar shadow crosses",
    "bar shadow jupiter",
    "bar shadow piano",
    "bar shadow dominos",
    "bar shadow pie",
    "bar shadow floor",
    "bar shadow bubbles",
    "bar shadow ticTac",
    "bar shadow zigZag"
  ]

  function getRandomLoadingBar() {   
    const randomNumber = Math.floor(Math.random() * 20) + 1;
    return loadingBarStyle[randomNumber];
  }
  
  const [loadingBar, setLoadingBar] = useState(getRandomLoadingBar);
    
  const [talk, setTalk] = useState(questions[0]);

  const onEnterProgress = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    setTalk("We are almost there! Just a few more questions to go.");
  };
  
  const onLeaveProgress = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    setTalk(questions[currentStep]);
  };

  const onEnterAvatar = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    gsap.to(currentTarget, { scale: 0.8 });
    gsap.to(currentTarget, { backgroundColor: getRandomColor()});
    setTalk("That is tickles!");
  };
  
  const onLeaveAvatar = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    gsap.to(currentTarget, { scale: 1 });
    setTalk(questions[currentStep]);
    gsap.to(currentTarget, { backgroundColor: "#6B4984"});
  };

  const onEnterButton = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    gsap.to(currentTarget, { scale: 0.8 });
    if (currentStep === 0) {
      setTalk("Great! Let's start.");
    } else {
      setTalk("Good job! Let's get to the next one.");
    }
  };
  
  const onLeaveButton = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    gsap.to(currentTarget, { scale: 1 });
    setTalk(questions[currentStep]);
  };

  const onEnterTextBox = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    gsap.to(currentTarget, { backgroundColor: getRandomColor()});
  };
  
  const onLeaveTextBox = ({ currentTarget }) => {
    let q = gsap.utils.selector(currentTarget);
    gsap.to(currentTarget, { backgroundColor: "#7FD8BE"});
  };

  const imageStyle = {
    borderRadius: '50%',
    border: '1px solid #000',
    backgroundColor: '#6B4984',
    marginBottom: '15px',
    marginRight: '10px',
  }

  const avatarImage = <Image style={imageStyle} src="/avatar-pic/Sport_Kangaroo.png" alt="avatar-img"
      width={150} 
      height={150} onMouseEnter={onEnterAvatar} onMouseLeave={onLeaveAvatar}/>

  const questionHeader = <h3 className="align-right"><div className='rcorners2' onMouseEnter={onEnterTextBox} onMouseLeave={onLeaveTextBox}>{talk} </div>
  {avatarImage}</h3>


  // Define all questions as components
  const questionComponents = [
    // Welcome screen
    <>
      {questionHeader}
    </>,

    // Question 1: 1.	WHO is involved within this story?
    <>
     {questionHeader}
      <Textarea
        value={answers.whoisInvolved}
        onChange={(e) => setAnswers({ ...answers, whoisInvolved: e.target.value })}
        placeholder="e.g., My mother, my friend Sarah, etc."
        className="sketchy"
      />
    </>,

    // Question 2: WHO can you trust to help you through a tough situation?
    <>
      {questionHeader}
      <Textarea
        value={answers.whoCanHelp}
        onChange={(e) => setAnswers({ ...answers, whoCanHelp: e.target.value })}
        placeholder="e.g., My mother, my friend Sarah, etc."
        className="sketchy"
      />
    </>,

    // Question 3: WHAT is the situation or challenge in your story? 
    <>
    {questionHeader}
    <Textarea
      value={answers.situation}
      onChange={(e) => setAnswers({ ...answers, situation: e.target.value })}
      placeholder="e.g. I have too much energy and fidget"
      className="sketchy"
    />
  </>,

  // Question 4: WHEN does this situation occur?
  <>
  {questionHeader}
  <Textarea
    value={answers.when}
    onChange={(e) => setAnswers({ ...answers, when: e.target.value })}
    placeholder="e.g., During story time"
    className="sketchy"
  />
</>,

    // Question 5: WHERE does it happen? 
    <>
    {questionHeader}
    <Textarea
      value={answers.where}
      onChange={(e) => setAnswers({ ...answers, where: e.target.value })}
      placeholder="e.g., in maths class"
      className="sketchy"
    />
  </>,

    // Question 6: WHY is this situation hard for you? 
    <>
     {questionHeader}
      <Textarea
        value={answers.why}
        onChange={(e) => setAnswers({ ...answers, why: e.target.value })}
        placeholder="e.g. I have too much energy"
        className="sketchy"
      />
    </>,

    // Question 7: WHAT strategy could help you feel better in this situation? 
    <>
      {questionHeader}
      <Textarea
        value={answers.whatStrategyHelps}
        onChange={(e) => setAnswers({ ...answers, whatStrategyHelps: e.target.value })}
        placeholder="e.g., Making friends, managing emotions, completing tasks independently"
        className="sketchy"
      />
    </>,

    // Question 8: HOW do you want the story to feel? 
    <>
      {questionHeader}
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
      {questionHeader}
      <Textarea
        value={answers.whatStoryShow}
        onChange={(e) => setAnswers({ ...answers, whatStoryShow: e.target.value })}
        placeholder="e.g., my strategies clearly listed, a character using my strategies"
        className="sketchy"
      />
    </>,

    // Finishing screen
    <>
      {questionHeader}
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
    setTalk(questions[currentStep]);
  };

  const goPrevStep = () => {
    setValidationError("");
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setTalk(questions[currentStep]);
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
    <div className="paper-like">
      {/* Progress bar */}
      <div className="mb-6" onMouseEnter={onEnterProgress} onMouseLeave={onLeaveProgress}>
        <div className="flex justify-between text-sm text-muted-foreground mb-2"  onMouseEnter={onEnterProgress} onMouseLeave={onLeaveProgress}>
          <b>Step {currentStep + 1} of {totalSteps}</b>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="progress">
          <div 
            className= {loadingBar}
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
            className="big-button"
            style={{ backgroundColor: "white" }}
            onMouseEnter={onEnterButton} onMouseLeave={onLeaveButton}            
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentStep < totalSteps - 1 ? (
            <Button 
              type="button" 
              onClick={goNextStep}
              className="big-button"
              disabled={!isCurrentQuestionAnswered()}
              onMouseEnter={onEnterButton} onMouseLeave={onLeaveButton}
            >                
              Next
              <Icons.chevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={loading || !isCurrentQuestionAnswered()}
              className="big-button"
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