"use client";

import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { UserSubscriptionPlan } from "types";
import type { Questionnaire } from "@prisma/client";
import { storytellers } from "@/config/storytellers";
import { StorytellerCard } from "@/components/dashboard/storyteller-card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";


export default function VideoGeneratorPage() {
  const { data: session } = useSession();
  const [userSubscription, setUserSubscription] = useState<UserSubscriptionPlan | null>(null);
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loadingQuestionnaires, setLoadingQuestionnaires] = useState(true);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState("");
  const [generatedVideo, setGeneratedVideo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStoryteller, setSelectedStoryteller] = useState<string>("");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch("/api/user-subscription");
        const data = await response.json();
        setUserSubscription(data as UserSubscriptionPlan);
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

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

  const handleGenerateVideo = async () => {
    if (!selectedQuestionnaire) {
      setError("Please select a questionnaire first");
      return;
    }

    if (!selectedStoryteller) {
      setError("Please select a storyteller");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/video-request", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          questionnaireId: selectedQuestionnaire,
          storytellerId: selectedStoryteller
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit request");
      }

      toast({
        title: "Success!",
        description: "Your video request has been submitted successfully.",
      });
      
      // Clear selections after successful submission
      setSelectedQuestionnaire("");
      setSelectedStoryteller("");
      setError("");
    } catch (err) {
      console.error("Video request error:", err);
      setError("Failed to process your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container grid gap-8">
        <>
          <DashboardHeader heading="Video Generator" text="Generate personalised videos based on your questionnaire responses."/>
        </>
    </div>;
  }

  // If user is not on a paid plan, show upgrade message
  if (!userSubscription?.isPaid) {
    return (
      <div className="container grid gap-8">
        <DashboardHeader
          heading="Video Generator"
          text="Generate personalised videos based on your questionnaire responses."
        />
        <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-card p-8 text-center">
          <h2 className="text-2xl font-bold">Pro Feature</h2>
          <p className="text-muted-foreground">
            The Video Generator is only available for Pro plan subscribers.
          </p>
          <Link href="/pricing">
            <Button>Upgrade to Pro</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container grid gap-8">
      <DashboardHeader
        heading="Video Generator"
        text="Generate personalised videos based on your questionnaire responses."
      />
      <div className="grid gap-8">
        {/* Questionnaire Selection */}
        <div className="rounded-lg border bg-card p-6">
          <Label htmlFor="questionnaire">Select Questionnaire</Label>
          <Select
            value={selectedQuestionnaire}
            onValueChange={setSelectedQuestionnaire}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a questionnaire" />
            </SelectTrigger>
            <SelectContent>
              {questionnaires.map((questionnaire) => (
                <SelectItem key={questionnaire.id} value={questionnaire.id}>
                  {format(new Date(questionnaire.createdAt), "PPP")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Storyteller Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Choose Your Storyteller</h2>
            {selectedStoryteller && (
              <p className="text-sm text-muted-foreground">
                Selected: {storytellers.find(s => s.id === selectedStoryteller)?.name}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {storytellers.map((storyteller) => (
              <StorytellerCard
                key={storyteller.id}
                storyteller={storyteller}
                isSelected={selectedStoryteller === storyteller.id}
                onSelect={setSelectedStoryteller}
              />
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex flex-col items-center gap-4">
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Button
            onClick={handleGenerateVideo}
            disabled={loading || !selectedQuestionnaire || !selectedStoryteller}
            size="lg"
            className="w-full max-w-md"
          >
            {loading ? "Submitting..." : "Request Video Generation"}
          </Button>
        </div>
      </div>
    </div>
  );
  
} 