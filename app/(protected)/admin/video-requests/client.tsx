'use client';

import { useEffect, useState } from 'react';
import { DataTable } from "@/components/admin/data-table";
import { VideoRequest, videoRequestColumns } from "@/components/admin/video-request-columns";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface VideoRequestsClientProps {
  initialRequests: VideoRequest[];
}

export function VideoRequestsClient({ initialRequests }: VideoRequestsClientProps) {
  const [requests, setRequests] = useState<VideoRequest[]>(initialRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchRequests = async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch('/api/video-request');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to refresh video requests');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Manual refresh handler
  const handleRefresh = () => {
    fetchRequests();
  };

  // Auto refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRequests();
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">
              Auto-refresh:
            </label>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300"
            />
          </div>
        </div>
        {autoRefresh && (
          <span className="text-sm text-muted-foreground">
            Auto-refreshing every 10 seconds
          </span>
        )}
      </div>
      <div className="rounded-lg border">
        <DataTable columns={videoRequestColumns} data={requests} />
      </div>
    </div>
  );
} 