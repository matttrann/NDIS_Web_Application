"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { storytellers } from "@/config/storytellers";
import { ScriptReview } from "@/components/admin/script-review";
import { VideoStatusDisplay } from "@/components/admin/video-status-display";
import { useState, useEffect } from "react";

export type VideoRequest = {
  id: string;
  userId: string;
  questionnaireId: string;
  storytellerId: string;
  status: string;
  script?: string | null;
  testVideoPath?: string | null;
  s3BasePath?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
  questionnaire: {
    answers: Record<string, any>;
  };
  storyteller?: typeof storytellers[0];
};

async function updateStatus(id: string, status: string) {
  try {
    const response = await fetch(`/api/video-request/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error();
    toast({
      title: "Success",
      description: "Video request status updated successfully",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update video request status",
      variant: "destructive",
    });
  }
}

// Component to display the test video
function TestVideoPreview({ testVideoPath }: { testVideoPath: string | null }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSignedS3Url() {
      if (!testVideoPath) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/signed-url?key=${encodeURIComponent(testVideoPath)}`);
        const data = await response.json();
        setVideoUrl(data.url);
      } catch (error) {
        console.error("Error getting signed URL:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getSignedS3Url();
  }, [testVideoPath]);

  if (!testVideoPath) {
    return <div className="text-sm text-muted-foreground">No video available</div>;
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading video preview...</div>;
  }

  return (
    <div className="w-full max-w-[300px]">
      <video 
        controls 
        className="w-full rounded-md border border-gray-200"
        src={videoUrl || undefined}
      >
        Your browser does not support the video tag.
      </video>
      <a 
        href={videoUrl || "#"} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline block mt-2"
      >
        Open in new tab
      </a>
    </div>
  );
}

export const videoRequestColumns: ColumnDef<VideoRequest>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue("user") as VideoRequest["user"];
      return (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "questionnaire",
    header: "Questionnaire #",
    cell: ({ row }) => {
      const questionnaireId = row.original.questionnaireId;
      if (!questionnaireId) {
        return <div className="font-medium">No ID</div>;
      }
      
      const shortId = questionnaireId.slice(-6).toUpperCase();
      
      return (
        <div className="font-medium">
          #{shortId}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const id = row.original.id;
      return <VideoStatusDisplay status={status} id={id} />;
    },
  },
  {
    accessorKey: "script",
    header: "Script Review",
    cell: ({ row }) => {
      const request = row.original;
      if (request.status === "script_pending_review" && request.script) {
        return (
          <ScriptReview
            videoRequestId={request.id}
            initialScript={request.script}
          />
        );
      }
      return (
        <div className="max-w-[400px] truncate">
          {request.script || "No script generated yet"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
  },
  {
    accessorKey: "storyteller",
    header: "Storyteller",
    cell: ({ row }) => {
      const storytellerId = row.original.storytellerId;
      const storyteller = storytellers.find(s => s.id === storytellerId);
      
      return (
        <div className="flex items-center gap-2">
          <Image
            src={storyteller?.avatar || ""}
            alt={storyteller?.name || ""}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium">{storyteller?.name}</p>
          </div>
        </div>
      );
    },
  }
]; 