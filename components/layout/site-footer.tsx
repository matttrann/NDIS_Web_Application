import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t", className)}>
      <div className="container flex max-w-6xl items-center justify-between py-4">
        <div className="text-left text-sm text-muted-foreground">
          <Link
            href="/privacy"
            className="font-medium underline underline-offset-4 mr-4"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="font-medium underline underline-offset-4"
          >
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}
