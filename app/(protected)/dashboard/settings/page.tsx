import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DeleteAccountSection } from "@/components/dashboard/delete-account";
import { DashboardHeader } from "@/components/dashboard/header";
import { UserNameForm } from "@/components/forms/user-name-form";
import { AdminDescriptionForm } from "@/components/forms/admin-description-form";

export const metadata = constructMetadata({
  title: "Settings – Skills4Life",
  description: "Configure your account and website settings.",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user?.id) redirect("/login");

  return (
    <>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        
        {/* Show the admin description form only for admins */}
        {user.role === "ADMIN" && (
          <AdminDescriptionForm user={{ id: user.id, description: user.description || "" }} />
        )}
        
        <DeleteAccountSection />
      </div>
    </>
  );
}
