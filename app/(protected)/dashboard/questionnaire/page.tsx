// This is a server component (no 'use client' directive)
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { QuestionnaireForm } from "@/app/(protected)/dashboard/questionnaire/questionnaire-form";
import { ClientQuestionnaire } from "./client-page";

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

  return <ClientQuestionnaire user={user} />;
}
