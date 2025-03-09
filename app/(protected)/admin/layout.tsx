import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getCurrentUser();
  
  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-8">
      {children}
    </div>
  );
}
