import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { GeneratedVideosClient } from "./client";

export default async function GeneratedVideosPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  // Get approved clients for this admin
  const approvedClients = await db.adminClientRelationship.findMany({
    where: {
      adminId: user.id,
      status: "APPROVED"
    },
    select: {
      clientId: true
    }
  });

  const clientIds = approvedClients.map(rel => rel.clientId);

  const pageSize = 10;
  const totalCount = await db.videoRequest.count({
    where: {
      testVideoPath: {
        not: null
      },
      userId: {
        in: clientIds
      }
    }
  });

  const videoRequests = await db.videoRequest.findMany({
    where: {
      testVideoPath: {
        not: null
      },
      userId: {
        in: clientIds
      }
    },
    select: {
      id: true,
      userId: true,
      testVideoPath: true,
      createdAt: true,
      status: true,
      isVisible: true,
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
        text="View and manage test videos generated for your clients."
      />
      <GeneratedVideosClient 
        initialVideos={initialData.data} 
        initialPagination={initialData.metadata} 
      />
    </div>
  );
}
