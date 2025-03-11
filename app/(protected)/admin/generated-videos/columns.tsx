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

// Extract S3 key from path (still needed for CloudFront)
const getS3KeyFromPath = (path: string | undefined): string | null => {
  if (!path) return null;
  
  if (path.startsWith('s3://')) {
    const parts = path.split('/');
    return parts.slice(1).join('/');
  }
  
  return path;
};

// Component for video preview
export function VideoPreview({ videoPath }: { videoPath?: string }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Comment out or remove debug state
  // const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const fetchUrl = async () => {
      setLoading(true);
      setError(null);
      // Comment out debug lines
      // setDebugInfo(`Starting fetch for path: ${videoPath}`);
      
      if (!videoPath) {
        setError("No video path available");
        setLoading(false);
        return;
      }
      
      const key = getS3KeyFromPath(videoPath);
      // Comment out debug lines
      // setDebugInfo(prev => `${prev}\nExtracted key: ${key}`);
      
      if (!key) {
        setError("Invalid video path");
        setLoading(false);
        return;
      }
      
      try {
        // Comment out debug lines
        // setDebugInfo(prev => `${prev}\nFetching signed URL for key: ${key}`);
        const response = await fetch(`/api/signed-url?key=${encodeURIComponent(key)}`);
        
        // Simplified response handling - remove debug lines
        if (!response.ok) {
          throw new Error(`Failed to fetch URL: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.url) {
          setVideoUrl(data.url);
        } else {
          setError("Failed to get video URL");
        }
      } catch (err) {
        setError(`Error loading video`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUrl();
  }, [videoPath]);

  if (loading) return <div className="w-full h-[150px] bg-muted animate-pulse"></div>;
  if (error) return <div className="text-sm text-red-500">{error}</div>;
  if (!videoUrl) return <div className="text-sm text-muted-foreground">Video unavailable</div>;
  
  return (
    <video 
      controls 
      className="w-full h-auto max-h-[150px] rounded-md" 
      src={videoUrl}
      onError={(e) => {
        console.error("Video error:", e);
        setError(`Error playing video`);
      }}
    >
      Your browser does not support the video tag.
    </video>
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
      return <VideoPreview videoPath={testVideoPath} />;
    },
  },
]; 