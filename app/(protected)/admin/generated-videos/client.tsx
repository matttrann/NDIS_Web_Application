"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/data-table";
import { generatedVideoColumns } from "./columns";
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

  const filteredVideos = videos.filter((video) => {
    const userName = video.user.name?.toLowerCase() || "";
    const userEmail = video.user.email?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return userName.includes(search) || userEmail.includes(search);
  });

  const fetchVideos = async (page: number) => {
    try {
      const response = await fetch(
        `/api/video-request?page=${page}&pageSize=${initialPagination.pageSize}&hasTestVideo=true`
      );
      const data = await response.json();
      setVideos(data.data);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filter by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-lg border">
        <DataTable columns={generatedVideoColumns} data={filteredVideos} />
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => fetchVideos(currentPage - 1)}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {Array.from({ length: initialPagination.pageCount }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => fetchVideos(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => fetchVideos(currentPage + 1)}
              disabled={currentPage === initialPagination.pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
} 