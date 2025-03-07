'use client';

import { useEffect, useState } from 'react';
import { DataTable } from "@/components/admin/data-table";
import { VideoRequest, videoRequestColumns } from "@/components/admin/video-request-columns";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface VideoRequestsClientProps {
  initialRequests: VideoRequest[];
  initialPagination: PaginationMetadata;
}

interface PaginationMetadata {
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export function VideoRequestsClient({ initialRequests, initialPagination }: VideoRequestsClientProps) {
  const [requests, setRequests] = useState<VideoRequest[]>(initialRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [pagination, setPagination] = useState<PaginationMetadata>(initialPagination);

  const fetchRequests = async (page = pagination.currentPage) => {
    try {
      setIsRefreshing(true);
      const response = await fetch(`/api/video-request?page=${page}&pageSize=${pagination.pageSize}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setRequests(data.data);
      setPagination(data.metadata);
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

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchRequests(page);
  };

  // Auto refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, pagination.currentPage]);

  // Add this useEffect after your existing useEffect for auto-refresh
  useEffect(() => {
    // Fetch requests on initial mount to ensure we have updated pagination data
    fetchRequests(pagination.currentPage);
    // Only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    const startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(pagination.pageCount, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={pagination.currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

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

      {pagination.pageCount > 1 && (
        <div className="flex justify-center mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.pageCount}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
} 