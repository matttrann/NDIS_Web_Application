'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ScriptReviewProps {
  videoRequestId: string;
  initialScript: string;
}

export function ScriptReview({ videoRequestId, initialScript }: ScriptReviewProps) {
  const [script, setScript] = useState(initialScript);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (action: 'approve' | 'reject') => {
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

  return (
    <div className="space-y-4">
      <Textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        className="min-h-[200px]"
        placeholder="Review and edit the generated script..."
      />
      <div className="flex gap-4">
        <Button
          onClick={() => handleAction('approve')}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
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