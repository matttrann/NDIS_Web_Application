"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { DataTable } from "@/components/admin/data-table";
import { generatedVideoColumns } from "./columns";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface GeneratedVideosClientProps {
  initialVideos: any[];
  initialPagination: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    pageSize: number;
  };
}

export function GeneratedVideosClient({
  initialVideos,
  initialPagination,
}: GeneratedVideosClientProps) {
  const [videos, setVideos] = useState(initialVideos);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initial load effect
  useEffect(() => {
    fetchLatestData();
    setIsInitialLoad(false);
  }, []);

  // Auto-refresh effect (optional, but useful for keeping data fresh)
  useEffect(() => {
    if (!isInitialLoad) {
      const interval = setInterval(() => {
        fetchLatestData(false); // Pass false to not show loading state
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [isInitialLoad, currentPage]);

  const fetchLatestData = async (showLoading = true) => {
    if (showLoading) {
      setIsRefreshing(true);
    }
    
    try {
      const response = await fetch(
        `/api/video-request?page=${currentPage}&pageSize=${initialPagination.pageSize}&hasTestVideo=true`
      );
      if (!response.ok) throw new Error('Failed to fetch videos');
      
      const data = await response.json();
      setVideos(data.data);
      
      if (showLoading) {
        toast.success('Videos refreshed');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      if (showLoading) {
        toast.error('Failed to refresh videos');
      }
    } finally {
      if (showLoading) {
        setIsRefreshing(false);
      }
    }
  };

  const handleRefresh = () => fetchLatestData(true);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchLatestData(true);
  };

  const filteredVideos = videos.filter((video) => {
    const userName = video.user.name?.toLowerCase() || "";
    const userEmail = video.user.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return userName.includes(search) || userEmail.includes(search);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Filter by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
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
        </div>
      </div>
      <div className="rounded-lg border">
        <DataTable columns={generatedVideoColumns} data={filteredVideos} />
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: initialPagination.pageCount }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === initialPagination.pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
} 