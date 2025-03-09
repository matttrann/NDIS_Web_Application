import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { DashboardHeader } from "@/components/dashboard/header";
import { AdminSelector } from "@/components/admin-request/admin-selector";

export default async function AdminAccessPage() {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "USER") {
    redirect("/login");
  }

  return (
    <div className="container grid gap-8">
      <DashboardHeader
        heading="Request Admin Access"
        text="Select an admin to request access to manage your information."
      />
      <AdminSelector />
    </div>
  );
} 