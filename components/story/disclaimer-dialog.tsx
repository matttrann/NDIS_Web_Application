import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DisclaimerDialog() {
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem("storyGeneratorDisclaimerAccepted");
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("storyGeneratorDisclaimerAccepted", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Important Notice</DialogTitle>
          <DialogDescription className="space-y-4">
            <p>
              Welcome to the Story Generator. Before proceeding, please note:
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li>
                This is an AI-powered tool that generates content based on your inputs.
                The outputs are unmoderated and can be unpredictable.
              </li>
              <li>
                While we strive for appropriate content, the AI may occasionally produce
                unexpected or irrelevant responses.
              </li>
              <li>
                By continuing, you agree that you have read and understood the disclaimer, our terms of service and privacy policy and agree to use this tool responsibly despite its limitations.
              </li>
            </ul>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                For more information, please read our{" "}
                <Link href="/privacy" className="underline hover:text-primary">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/terms" className="underline hover:text-primary">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAccept} className="w-full">
            I Understand and Accept
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 