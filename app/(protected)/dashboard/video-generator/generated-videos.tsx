"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface GeneratedVideo {
  id: string;
  testVideoPath: string;
  createdAt: Date;
  storytellerId: string;
}

export function GeneratedVideos() {
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [loadingUrls, setLoadingUrls] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/videos');
      if (!response.ok) throw new Error('Failed to fetch videos');
      
      const data = await response.json();
      console.log('Fetched videos:', data); // Debug log
      setVideos(data);
      
      // Initialize loading states for each video
      const initialLoadingStates: Record<string, boolean> = {};
      data.forEach((video: GeneratedVideo) => {
        initialLoadingStates[video.id] = true;
      });
      setLoadingUrls(initialLoadingStates);

      // Get signed URLs for all videos
      for (const video of data) {
        if (video.testVideoPath) {
          try {
            const urlResponse = await fetch(`/api/signed-url?key=${encodeURIComponent(video.testVideoPath)}`);
            if (!urlResponse.ok) throw new Error('Failed to get signed URL');
            const urlData = await urlResponse.json();
            setVideoUrls(prev => ({
              ...prev,
              [video.id]: urlData.url
            }));
          } catch (error) {
            console.error('Error getting signed URL for video:', error);
            toast.error('Failed to load some video URLs');
          } finally {
            setLoadingUrls(prev => ({
              ...prev,
              [video.id]: false
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast.error('Failed to load your videos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Generated Videos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-[200px] w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Your Generated Videos</h2>
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            No videos available yet. Generated videos that are approved by admins will appear here.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Generated Videos</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="p-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
              {loadingUrls[video.id] ? (
                <Skeleton className="h-[200px] w-full" />
              ) : videoUrls[video.id] ? (
                <video
                  controls
                  className="w-full rounded-md"
                  src={videoUrls[video.id]}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Failed to load video
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 