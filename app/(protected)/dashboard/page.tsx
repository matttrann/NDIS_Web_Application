import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { db } from "@/lib/db";
import { AdminRequestSection } from "@/components/dashboard/admin-request-section";

export const metadata = constructMetadata({
  title: "Dashboard – Skills4Life",
  description: "Create and manage content.",
});

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  // Fetch available admins
  const admins = await db.user.findMany({
    where: {
      role: "ADMIN"
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      description: true
    }
  });

  // Fetch user's existing admin relationships
  const existingRequests = await db.adminClientRelationship.findMany({
    where: {
      clientId: user.id
    },
    include: {
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  return (
    <>
      <DashboardHeader
        heading="Dashboard"
        text="Request and manage your admin access."
      />
      <AdminRequestSection 
        admins={admins} 
        existingRequests={existingRequests}
      />
    </>
  );
}
