import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionnaireLoading() {
  return (
    <div className="container grid gap-8">
      <DashboardHeader
        heading="Questionnaire"
        text="Complete your questionnaire to help us understand your needs."
      />
      <div className="grid gap-8">
        <div className="rounded-lg border bg-card p-8">
          {/* Question sections */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-6">
              {/* Question label */}
              <Skeleton className="mb-2 h-4 w-3/4" />
              {/* Input field */}
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          
          {/* Submit button */}
          <Skeleton className="mt-8 h-10 w-[200px]" />
        </div>
      </div>
    </div>
  );
}
