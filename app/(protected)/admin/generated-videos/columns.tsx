"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { VideoStatusDisplay } from "@/components/admin/video-status-display";

interface GeneratedVideo {
  id: string;
  userId: string;
  testVideoPath: string;
  createdAt: Date;
  status: string;
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const id = row.original.id;
      return <VideoStatusDisplay status={status} id={id} />;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Generated At",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
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