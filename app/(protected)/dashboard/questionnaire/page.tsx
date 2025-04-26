// This is a server component (no 'use client' directive)
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { QuestionnaireForm } from "@/app/(protected)/dashboard/questionnaire/questionnaire-form";
import { ClientQuestionnaire } from "./client-page";
import { db } from "@/lib/db";

export const metadata = constructMetadata({
  title: "Questionnaire – Skills4Life",
  description: "Complete your questionnaire.",
});

export default async function QuestionnairePage() {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/login");
  }

  // If user is an admin, redirect them to admin dashboard
  if (user.role === "ADMIN") {
    redirect("/admin");
  }
  
  // Check if the user has any approved admin relationships
  const approvedAdminRelationships = await db.adminClientRelationship.findMany({
    where: {
      clientId: user.id,
      status: "APPROVED"
    }
  });
  
  // Get all admin relationships for the user
  const allAdminRelationships = await db.adminClientRelationship.findMany({
    where: {
      clientId: user.id
    }
  });

  return (
    <ClientQuestionnaire 
      user={user} 
      hasApprovedAdmin={approvedAdminRelationships.length > 0}
      hasRequestedAdmin={allAdminRelationships.length > 0}
    />
  );
}
