import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { ClientRequests } from "@/components/admin/client-requests";
import { ApprovedClients } from "@/components/admin/approved-clients";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  // Fetch pending requests
  const pendingRequests = await db.adminClientRelationship.findMany({
    where: {
      adminId: user.id,
      status: "PENDING"
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

  // Fetch approved clients
  const approvedClients = await db.adminClientRelationship.findMany({
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
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading="Dashboard"
        text="Manage your clients and their requests."
      />

      <div className="grid gap-8">
        {/* Client Management Section */}
        <Tabs defaultValue="clients" className="w-full">
          <TabsList>
            <TabsTrigger value="clients">My Clients</TabsTrigger>
            <TabsTrigger value="requests">
              Client Requests
              {pendingRequests.length > 0 && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients" className="mt-4">
            <ApprovedClients clients={approvedClients} />
          </TabsContent>
          
          <TabsContent value="requests" className="mt-4">
            <ClientRequests requests={pendingRequests} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
