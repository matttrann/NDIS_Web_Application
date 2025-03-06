'use client';

import { DashboardHeader } from "@/components/dashboard/header";
import { QuestionnaireForm } from "@/app/(protected)/dashboard/questionnaire/questionnaire-form";
import { WelcomeToast } from "@/components/welcome-toast";
import { User } from "@prisma/client"; // Import the User type if needed

interface ClientQuestionnaireProps {
  user: User;
}

export function ClientQuestionnaire({ user }: ClientQuestionnaireProps) {
  return (
    <div className="container grid gap-8">
      <WelcomeToast username={user.name} />
      <DashboardHeader
        heading="Questionnaire"
        text="Complete your questionnaire to help us understand your needs."
      />
      <div className="grid gap-8">
        <QuestionnaireForm userId={user.id} />
      </div>
    </div>
  );
} 