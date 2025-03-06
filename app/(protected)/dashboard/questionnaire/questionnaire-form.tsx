"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      const data = await response.json();

      if (response.ok) {
        router.refresh();
        toast({
          title: "Success",
          description: "Your questionnaire has been submitted!",
        });
      } else {
        throw new Error(data?.error || "Failed to submit questionnaire");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Emotional State */}
      <div>
        <label className="block mb-2 font-medium">How are you feeling today?</label>
        <Select onValueChange={(value) => setAnswers({ ...answers, emotionalState: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your mood" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="😊 Happy">😊 Happy</SelectItem>
            <SelectItem value="😐 Neutral">😐 Neutral</SelectItem>
            <SelectItem value="😞 Sad">😞 Sad</SelectItem>
            <SelectItem value="😰 Anxious">😰 Anxious</SelectItem>
            <SelectItem value="😡 Angry">😡 Angry</SelectItem>
            <SelectItem value="💤 Tired">💤 Tired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Energy Level */}
      <div>
        <label className="block mb-2 font-medium">Rate your energy today:</label>
        <div className="flex items-center gap-4">
          <span>1</span>
          <Slider
            defaultValue={[5]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setAnswers({ ...answers, energyLevel: value[0] })}
          />
          <span>10</span>
        </div>
      </div>

      {/* Daily Challenges */}
      <div>
        <label className="block mb-2 font-medium">What's been the hardest part of your day/week?</label>
        <Textarea
          value={answers.dailyChallenges}
          onChange={(e) => setAnswers({ ...answers, dailyChallenges: e.target.value })}
          placeholder="e.g., Transitions, social interactions, sensory overload, routines"
        />
      </div>

      {/* Support Needs */}
      <div>
        <label className="block mb-2 font-medium">What tasks or activities do you need help with most?</label>
        <div className="grid grid-cols-2 gap-2">
          {['Self-care', 'Communication', 'Mobility', 'Emotional regulation', 'Learning'].map((option) => (
            <div key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={option}
                value={option}
                onChange={(e) => {
                  const newSupportNeeds = e.target.checked
                    ? [...answers.supportNeeds, option]
                    : answers.supportNeeds.filter((item: string) => item !== option);
                  setAnswers({ ...answers, supportNeeds: newSupportNeeds });
                }}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Social Comfort */}
      <div>
        <label className="block mb-2 font-medium">How comfortable do you feel interacting with others?</label>
        <div className="flex items-center gap-4">
          <span>1</span>
          <Slider
            defaultValue={[5]}
            min={1}
            max={10}
            step={1}
            onValueChange={(value) => setAnswers({ ...answers, socialComfort: value[0] })}
          />
          <span>10</span>
        </div>
      </div>

        {/* Triggers */}
            <div>
        <label className="block mb-2 font-medium">What usually makes you feel upset or overwhelmed?</label>
        <div className="grid grid-cols-2 gap-2">
          {['Loud noises', 'Changes in plans', 'Criticism', 'Crowded spaces'].map((option) => (
            <div key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={option}
                value={option}
                onChange={(e) => {
                  const newTriggers = e.target.checked
                    ? [...answers.triggers, option]
                    : answers.triggers.filter((item: string) => item !== option);
                  setAnswers({ ...answers, triggers: newTriggers });
                }}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Calming Strategies */}
      <div>
        <label className="block mb-2 font-medium">What helps you feel calm when you're stressed?</label>
        <Textarea
          value={answers.calmingStrategies}
          onChange={(e) => setAnswers({ ...answers, calmingStrategies: e.target.value })}
          placeholder="e.g., Deep breathing, quiet time, music, fidget tools"
        />
      </div>

      {/* Goals */}
      <div>
        <label className="block mb-2 font-medium">What's one thing you'd like to get better at?</label>
        <Input
          value={answers.goals}
          onChange={(e) => setAnswers({ ...answers, goals: e.target.value })}
          placeholder="e.g., Making friends, managing emotions, completing tasks independently"
        />
      </div>

      {/* Strengths */}
      <div>
        <label className="block mb-2 font-medium">What are you really good at or proud of?</label>
        <Textarea
          value={answers.strengths}
          onChange={(e) => setAnswers({ ...answers, strengths: e.target.value })}
        />
      </div>

      {/* Communication Preferences */}
      <div>
        <label className="block mb-2 font-medium">How do you prefer to communicate?</label>
        <Select onValueChange={(value) => setAnswers({ ...answers, communicationPreferences: value })}>
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
      </div>

      {/* Learning Style */}
      <div>
        <label className="block mb-2 font-medium">How do you learn best?</label>
        <Select onValueChange={(value) => setAnswers({ ...answers, learningStyle: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your learning style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Watching videos">Watching videos</SelectItem>
            <SelectItem value="Listening">Listening</SelectItem>
            <SelectItem value="Reading">Reading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sensory Sensitivities */}
      <div>
        <label className="block mb-2 font-medium">Do any of these bother you?</label>
        <div className="grid grid-cols-2 gap-2">
          {['Bright lights', 'Loud sounds', 'Certain textures', 'Strong smells'].map((option) => (
            <div key={option} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={option}
                value={option}
                onChange={(e) => {
                  const newSensitivities = e.target.checked
                    ? [...answers.sensorySensitivities, option]
                    : answers.sensorySensitivities.filter((item: string) => item !== option);
                  setAnswers({ ...answers, sensorySensitivities: newSensitivities });
                }}
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Interests/Passions */}
      <div>
        <label className="block mb-2 font-medium">What do you love doing or learning about?</label>
        <Textarea
          value={answers.interests}
          onChange={(e) => setAnswers({ ...answers, interests: e.target.value })}
        />
      </div>

      {/* Story Character Preference */}
      <div>
        <label className="block mb-2 font-medium">Who should the main character in your story be?</label>
        <Select onValueChange={(value) => setAnswers({ ...answers, storyCharacter: value })}>
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
      </div>

      {/* Story Tone */}
      <div>
        <label className="block mb-2 font-medium">What kind of story do you want?</label>
        <Select onValueChange={(value) => setAnswers({ ...answers, storyTone: value })}>
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
      </div>

      {/* Support Network */}
      <div>
        <label className="block mb-2 font-medium">Who helps you most often?</label>
        <Select onValueChange={(value) => setAnswers({ ...answers, supportNetwork: value })}>
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
      </div>

      {/* Independence Goals */}
      <div>
        <label className="block mb-2 font-medium">What's one thing you'd like to try doing on your own?</label>
        <Input
          value={answers.independenceGoals}
          onChange={(e) => setAnswers({ ...answers, independenceGoals: e.target.value })}
        />
      </div>


      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Questionnaire"}
      </Button>
    </form>
  );
} 