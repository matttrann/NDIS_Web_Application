import { Suspense } from "react";
import { Icons } from "@/components/shared/icons";
import { UserAuthForm } from "@/components/forms/user-auth-form";

export default function IndexPage() {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome to Skills4Life
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to get started
          </p>
        </div>
        <Suspense>
          <UserAuthForm />
        </Suspense>
      </div>
    </div>
  );
}
