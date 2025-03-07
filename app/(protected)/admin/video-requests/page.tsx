import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { DataTable } from "@/components/admin/data-table";
import { VideoRequest, videoRequestColumns } from "@/components/admin/video-request-columns";
import { db } from "@/lib/db";
import { VideoRequestsClient } from "./client";

export default async function VideoRequestsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const pageSize = 10;
  const totalCount = await db.videoRequest.count();

  const videoRequests = await db.videoRequest.findMany({
    select: {
      id: true,
      userId: true,
      questionnaireId: true,
      storytellerId: true,
      status: true,
      script: true,
      testVideoPath: true,
      s3BasePath: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      questionnaire: {
        select: {
          answers: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: pageSize,
  });

  const initialData = {
    data: videoRequests,
    metadata: {
      totalCount,
      pageCount: Math.ceil(totalCount / pageSize),
      currentPage: 1,
      pageSize,
    }
  };

  return (
    <div className="container grid gap-8">
      <DashboardHeader
        heading="Video Requests"
        text="Manage video generation requests from users."
      />
      <VideoRequestsClient 
        initialRequests={initialData.data} 
        initialPagination={initialData.metadata} 
      />
    </div>
  );
} 