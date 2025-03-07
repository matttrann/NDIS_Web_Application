import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { GeneratedVideosClient } from "./client";

export default async function GeneratedVideosPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const pageSize = 10;
  const totalCount = await db.videoRequest.count({
    where: {
      testVideoPath: {
        not: null
      }
    }
  });

  const videoRequests = await db.videoRequest.findMany({
    where: {
      testVideoPath: {
        not: null
      }
    },
    select: {
      id: true,
      userId: true,
      testVideoPath: true,
      createdAt: true,
      status: true,
      user: {
        select: {
          name: true,
          email: true,
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
        heading="Generated Videos"
        text="View and manage test videos generated for users."
      />
      <GeneratedVideosClient 
        initialVideos={initialData.data} 
        initialPagination={initialData.metadata} 
      />
    </div>
  );
}
