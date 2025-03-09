import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { ClientsList } from "./clients-list";

export default async function MyClientsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  const clients = await db.adminClientRelationship.findMany({
    where: {
      adminId: user.id,
      status: "APPROVED"
    },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          questionnaires: {
            select: {
              id: true,
              createdAt: true
            }
          },
          videoRequests: {
            select: {
              id: true,
              status: true,
              createdAt: true
            }
          }
        }
      }
    }
  });

  return (
    <>
      <DashboardHeader
        heading="My Clients"
        text="View and manage your assigned clients."
      />
      <ClientsList clients={clients} />
    </>
  );
} 