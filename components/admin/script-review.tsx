'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

// Constants for word limits
const MIN_WORD_COUNT = 40;
const MAX_WORD_COUNT = 100;

interface ScriptReviewProps {
  videoRequestId: string;
  initialScript: string;
}

export function ScriptReview({ videoRequestId, initialScript }: ScriptReviewProps) {
  const [script, setScript] = useState(initialScript);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  // Calculate word count when script changes
  useEffect(() => {
    // Count words (split by whitespace and filter out empty strings)
    const words = script.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [script]);
  
  // Check if word count is within limits
  const isWordCountValid = wordCount >= MIN_WORD_COUNT && wordCount <= MAX_WORD_COUNT;

  const handleAction = async (action: 'approve' | 'reject') => {
    // For approval, validate word count
    if (action === 'approve' && !isWordCountValid) {
      toast.error(`Script must be between ${MIN_WORD_COUNT} and ${MAX_WORD_COUNT} words`);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/video-request/${videoRequestId}/script`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, action }),
      });

      if (!response.ok) {
        throw new Error('Failed to process script');
      }

      toast.success(
        action === 'approve' 
          ? 'Script approved. Video generation started.' 
          : 'Script rejected'
      );
    } catch (error) {
      toast.error('Failed to process script');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get style for word count badge
  const getWordCountStyle = () => {
    if (wordCount < MIN_WORD_COUNT) return "bg-red-500";
    if (wordCount > MAX_WORD_COUNT) return "bg-red-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Edit Script</h3>
        <Badge className={getWordCountStyle()}>
          {wordCount} words {!isWordCountValid && `(${MIN_WORD_COUNT}-${MAX_WORD_COUNT} required)`}
        </Badge>
      </div>
      
      <Textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        className={`min-h-[200px] ${!isWordCountValid ? 'border-red-500' : ''}`}
        placeholder="Review and edit the generated script..."
      />
      
      <div className="flex gap-4">
        <Button
          onClick={() => handleAction('approve')}
          disabled={isSubmitting || !isWordCountValid}
          className="bg-green-600 hover:bg-green-700"
          title={!isWordCountValid ? `Script must be between ${MIN_WORD_COUNT} and ${MAX_WORD_COUNT} words` : ""}
        >
          Approve & Generate Video
        </Button>
        <Button
          onClick={() => handleAction('reject')}
          disabled={isSubmitting}
          variant="destructive"
        >
          Reject Script
        </Button>
      </div>
    </div>
  );
} 