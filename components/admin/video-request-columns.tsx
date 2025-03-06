"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { storytellers } from "@/config/storytellers";
import { ScriptReview } from "@/components/admin/script-review";
import { VideoStatusDisplay } from "@/components/admin/video-status-display";

export type VideoRequest = {
  id: string;
  userId: string;
  questionnaireId: string;
  storytellerId: string;
  status: string;
  script?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string | null;
  };
  questionnaire: {
    answers: Record<string, any>;
  };
  storyteller?: typeof storytellers[0];
};

async function updateStatus(id: string, status: string) {
  try {
    const response = await fetch(`/api/video-request/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error();
    toast({
      title: "Success",
      description: "Video request status updated successfully",
    });
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to update video request status",
      variant: "destructive",
    });
  }
}

export const videoRequestColumns: ColumnDef<VideoRequest>[] = [
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.getValue("user") as VideoRequest["user"];
      return (
        <div>
          <p className="font-medium">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "questionnaire",
    header: "Questionnaire #",
    cell: ({ row }) => {
      const questionnaireId = row.original.questionnaireId;
      // Take the last 6 characters of the ID to make it shorter
      const shortId = questionnaireId.slice(-6).toUpperCase();
      
      return (
        <div className="font-medium">
          #{shortId}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const id = row.original.id;
      return <VideoStatusDisplay status={status} id={id} />;
    },
  },
  {
    accessorKey: "script",
    header: "Script Review",
    cell: ({ row }) => {
      const request = row.original;
      if (request.status === "script_pending_review" && request.script) {
        return (
          <ScriptReview
            videoRequestId={request.id}
            initialScript={request.script}
          />
        );
      }
      return (
        <div className="max-w-[400px] truncate">
          {request.script || "No script generated yet"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Requested",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
  },
  {
    accessorKey: "storyteller",
    header: "Storyteller",
    cell: ({ row }) => {
      const storytellerId = row.original.storytellerId;
      const storyteller = storytellers.find(s => s.id === storytellerId);
      
      return (
        <div className="flex items-center gap-2">
          <Image
            src={storyteller?.avatar || ""}
            alt={storyteller?.name || ""}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-medium">{storyteller?.name}</p>
          </div>
        </div>
      );
    },
  },
]; 