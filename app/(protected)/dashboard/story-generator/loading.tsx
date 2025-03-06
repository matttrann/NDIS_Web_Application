import { DashboardHeader } from "@/components/dashboard/header";
import { CardSkeleton } from "@/components/shared/card-skeleton";

export default function AvatarChatLoading() {
  return (
    <>
      <DashboardHeader
        heading="Story Generator"
        text="Generate personalised stories based on your submitted questionnaire and get guidance and support."
      />
      <div className="grid gap-8">
        <CardSkeleton />
      </div>
    </>
  );
} 