"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardHeader } from "@/components/dashboard/header";
import { AvatarSelector } from "@/components/story/avatar-selector";
import { DisclaimerDialog } from "@/components/story/disclaimer-dialog";

interface Questionnaire {
  id: string;
  createdAt: Date;
  answers: {
    independenceGoals?: string;
  };
}

export default function StoryGeneratorPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(true);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [generatedStory, setGeneratedStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);
  
  const sentences = useMemo(() => {
    if (!generatedStory) return [];
    return generatedStory
      .split(/(?<=[.!?])\s+/)
      .filter(sentence => sentence.trim())
      .map(sentence => sentence.trim());
  }, [generatedStory]);

  // Helper function to format text
  const formatText = (text: string) => {
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([.,!?])/g, '$1 ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Reset sentence index when story changes
  useEffect(() => {
    if (generatedStory) {
      setCurrentSentenceIndex(0);
    }
  }, [generatedStory]);

  // Word-by-word animation effect
  useEffect(() => {
    if (generatedStory && sentences[currentSentenceIndex]) {
      const words = sentences[currentSentenceIndex].split(' ').filter(word => word.length > 0);
      setDisplayedWords([]);
      
      let wordIndex = 0;
      const interval = setInterval(() => {
        if (wordIndex < words.length) {
          setDisplayedWords(prev => [...prev, words[wordIndex]]);
          wordIndex++;
        } else {
          clearInterval(interval);
        }
      }, 150);

      return () => clearInterval(interval);
    }
  }, [currentSentenceIndex, generatedStory, sentences]);

  useEffect(() => {
    const fetchQuestionnaires = async () => {
      try {
        const res = await fetch("/api/questionnaires");
        const data = await res.json();
        setQuestionnaires(data);
      } catch (error) {
        console.error("Failed to fetch questionnaires:", error);
      } finally {
        setLoadingQuestionnaires(false);
      }
    };

    fetchQuestionnaires();
  }, []);

  const handleGenerateStory = async () => {
    if (!selectedQuestionnaire) {
      setError("Please select a questionnaire first");
      return;
    }

    if (!selectedAvatar) {
      setError("Please select an avatar");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/questionnaire/${selectedQuestionnaire}`);
      const questionnaireData = await res.json();
      
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionnaireData }),
      });

      const { text } = await response.json();
      setGeneratedStory(text);
      setError("");
    } catch (err) {
      setError("Failed to generate story. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container grid gap-8">
      <DisclaimerDialog />
      
      <DashboardHeader
        heading="Story Generator"
        text="Generate personalised stories based on your submitted questionnaire and get guidance and support."
      />
      
      <div className="space-y-6">
        <div className="flex flex-col gap-6">
          <Select onValueChange={setSelectedQuestionnaire}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a questionnaire" />
            </SelectTrigger>
            <SelectContent>
              {loadingQuestionnaires ? (
                <div className="p-2 text-sm">Loading questionnaires...</div>
              ) : questionnaires.length > 0 ? (
                questionnaires.map((q: Questionnaire) => (
                  <SelectItem key={q.id} value={q.id}>
                    {new Date(q.createdAt).toLocaleDateString()} - {q.answers.independenceGoals?.substring(0, 20)}...
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-sm">No questionnaires found</div>
              )}
            </SelectContent>
          </Select>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Choose your storyteller</h3>
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelectAvatar={setSelectedAvatar}
            />
          </div>

          <Button 
            onClick={handleGenerateStory}
            disabled={loading || !selectedAvatar}
            className="w-fit"
          >
            {loading ? "Generating..." : "Generate Story"}
          </Button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {/* Chat Interface - Only show when story is generated */}
        {generatedStory && selectedAvatar && (
          <div className="mt-8 flex gap-8">
            {/* Avatar Column */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-8">
                <Image
                  src={`/avatars/avatar${selectedAvatar}.gif`}
                  alt="Avatar"
                  width={320}
                  height={320}
                  className="rounded-full"
                />
              </div>
            </div>

            {/* Chat Content Column */}
            <div className="flex-1">
              <div className="relative bg-muted rounded-2xl p-6 ml-4">
                {/* Chat Bubble Pointer */}
                <div className="absolute left-[-12px] top-6 w-4 h-4 bg-muted transform rotate-45" />
                
                <div className="prose max-w-none min-h-[200px] flex flex-col justify-between">
                  <div className="mb-4">
                    {displayedWords.map((word, index) => (
                      <span
                        key={index}
                        className="animate-fade-in"
                      >
                        {word}
                        {index < displayedWords.length - 1 ? ' ' : ''}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentSentenceIndex(prev => prev - 1)}
                      disabled={currentSentenceIndex === 0 || displayedWords.length < sentences[currentSentenceIndex]?.split(' ').length}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setCurrentSentenceIndex(prev => prev + 1)}
                      disabled={currentSentenceIndex === sentences.length - 1 || displayedWords.length < sentences[currentSentenceIndex]?.split(' ').length}
                    >
                      {currentSentenceIndex === sentences.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}