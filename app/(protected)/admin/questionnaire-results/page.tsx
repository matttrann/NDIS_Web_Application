import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { QuestionnaireResultsTable } from "@/components/admin/questionnaire-results-table";
import { Questionnaire, questionnaireColumns } from "@/components/admin/questionnaire-columns";
import { db } from "@/lib/db";

export const metadata = constructMetadata({
  title: "Questionnaire Results – Admin",
  description: "View detailed questionnaire responses from users.",
});

export default async function QuestionnaireResultsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") redirect("/login");

  // Get approved clients
  const approvedClients = await db.adminClientRelationship.findMany({
    where: {
      adminId: user.id,
      status: "APPROVED"
    },
    select: {
      clientId: true
    }
  });

  const clientIds = approvedClients.map(rel => rel.clientId);

  // Only fetch questionnaires from assigned clients
  const questionnaires = await db.questionnaire.findMany({
    where: {
      userId: {
        in: clientIds
      }
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <DashboardHeader
        heading="Questionnaire Results"
        text="View and analyse user questionnaire responses."
      />
      <div className="container mx-auto py-6">
        <QuestionnaireResultsTable 
          columns={questionnaireColumns} 
          data={questionnaires as Questionnaire[]} 
        />
      </div>
    </>
  );
}