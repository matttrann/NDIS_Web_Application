import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { ClientRequestsTable } from "./client-requests-table";

export default async function ClientRequestsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const pendingRequests = await db.adminClientRelationship.findMany({
    where: {
      adminId: user.id,
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <>
      <DashboardHeader
        heading="Client Requests"
        text="Manage access requests from users."
      />
      <ClientRequestsTable requests={pendingRequests} />
    </>
  );
} 