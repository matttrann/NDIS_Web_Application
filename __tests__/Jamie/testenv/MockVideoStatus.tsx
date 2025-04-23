'use client';

import { VIDEO_STATUS } from "@/lib/constants/video-status";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface VideoStatusDisplayProps {
  status: string;
  id: string;
}

async function updateStatus(id: string, status: string) {
  try {
    const response = await fetch(`/api/video-request/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error();
    toast.success("Video request status updated successfully");
  } catch (error) {
    toast.error("Failed to update video request status");
  }
}

export function VideoStatusDisplay({ status, id }: VideoStatusDisplayProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const statusInfo = VIDEO_STATUS[status as keyof typeof VIDEO_STATUS] || {
    label: status,
    description: "",
    progress: 0
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    await updateStatus(id, newStatus);
    setIsUpdating(false);
  };

  return (
    <div className="space-y-3 min-w-[200px]">
      <div>
        <div className="flex items-center gap-2">
          <span role="status-indicator" className={cn(
            "h-2 w-2 rounded-full",
            status === "completed" ? "bg-green-500" :
            status === "failed" || status === "script_rejected" ? "bg-red-500" :
            "bg-blue-500 animate-pulse"
          )} />
          <p className="font-medium">{statusInfo.label}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {statusInfo.description}
        </p>
      </div>

      {/* Progress bar */}
      <Progress 
        value={statusInfo.progress} 
        className={cn(
          "h-2",
          status === "completed" ? "bg-green-100" :
          status === "failed" || status === "script_rejected" ? "bg-red-100" :
          "bg-blue-100"
        )}
      />

      {/* Action buttons for pending status */}
      {status === "pending" && (
        <div className="flex gap-2 mt-2">
          <Button 
            size="sm" 
            onClick={() => handleStatusUpdate("approved")}
            disabled={isUpdating}
          >
            Approve
          </Button>
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={() => handleStatusUpdate("rejected")}
            disabled={isUpdating}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
} 