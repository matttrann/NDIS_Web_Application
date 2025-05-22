'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { QuestionnaireForm } from "@/app/(protected)/dashboard/questionnaire/questionnaire-form";
import { WelcomeToast } from "@/components/welcome-toast";
import { User } from "@prisma/client";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/shared/icons";
import "@/styles/questionnaire-bg.css";
import "@/styles/shootingStar.css";

interface ClientQuestionnaireProps {
  user: User;
  hasApprovedAdmin: boolean;
  hasRequestedAdmin: boolean;
}

export function ClientQuestionnaire({ user, hasApprovedAdmin, hasRequestedAdmin }: ClientQuestionnaireProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(!hasApprovedAdmin);
  
  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  const dialogMessage = hasRequestedAdmin
    ? "You've requested admin access, but your request hasn't been approved yet. Please wait for an admin to approve your request before accessing the questionnaire."
    : "Before accessing the questionnaire, you need to request access from an admin. Please go to the dashboard to request admin access.";

  const dialogTitle = hasRequestedAdmin
    ? "Waiting for Admin Approval"
    : "Admin Access Required";

  return (
    <div className="container grid gap-8">
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription>
              {dialogMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={navigateToDashboard} className="w-full">
              {hasRequestedAdmin ? "Check Request Status" : "Request Admin Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg p-8">
        <WelcomeToast username={user.name} />
        <DashboardHeader
          heading="Questionnaire"
          text="Tell us your story, so we can understand your needs."
        />
        {hasApprovedAdmin ? (
          <div className="grid gap-8">
            <QuestionnaireForm userId={user.id} />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <Icons.userPlus className="size-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Admin Approval Required</h3>
              <p className="text-muted-foreground max-w-sm">
                {dialogMessage}
              </p>
              <Button onClick={navigateToDashboard} className="mt-4">
                {hasRequestedAdmin ? "Check Request Status" : "Request Admin Access"}
              </Button>
            </div>
          </div>          
        )}
      </div>
    </div>
  );
} 