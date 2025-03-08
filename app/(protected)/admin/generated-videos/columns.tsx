"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface GeneratedVideo {
  id: string;
  userId: string;
  testVideoPath: string;
  createdAt: Date;
  isVisible?: boolean;
  user: {
    name: string | null;
    email: string | null;
  };
}

// Component to display the test video
function TestVideoPreview({ testVideoPath }: { testVideoPath: string }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getSignedS3Url() {
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

// Simplified visibility toggle component that only updates when needed
function VideoVisibilityToggle({ id, initialVisibility }: { id: string, initialVisibility?: boolean }) {
  const [isVisible, setIsVisible] = useState(initialVisibility ?? false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update state when initialVisibility changes (e.g., after page refresh)
  useEffect(() => {
    if (initialVisibility !== undefined) {
      setIsVisible(initialVisibility);
    }
  }, [initialVisibility]);

  const toggleVisibility = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/video-request/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !isVisible }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update visibility');
      }
      
      const data = await response.json();
      setIsVisible(data.isVisible);
      toast.success('Video visibility updated');
    } catch (error) {
      console.error('Error updating visibility:', error);
      toast.error('Failed to update video visibility');
      setIsVisible(isVisible);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={isVisible}
        onCheckedChange={toggleVisibility}
        disabled={isUpdating}
      />
      <span className="text-sm text-muted-foreground">
        {isVisible ? 'Visible' : 'Hidden'}
      </span>
    </div>
  );
}

export const generatedVideoColumns: ColumnDef<GeneratedVideo>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue("user") as GeneratedVideo["user"];
      return (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Generated At",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
  },
  {
    accessorKey: "isVisible",
    header: "Visibility",
    cell: ({ row }) => {
      return (
        <VideoVisibilityToggle 
          id={row.original.id} 
          initialVisibility={row.getValue("isVisible")}
        />
      );
    },
  },
  {
    accessorKey: "testVideoPath",
    header: "Video Preview",
    cell: ({ row }) => {
      const testVideoPath = row.getValue("testVideoPath") as string;
      return <TestVideoPreview testVideoPath={testVideoPath} />;
    },
  },
]; 