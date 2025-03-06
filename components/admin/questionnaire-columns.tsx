"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Questionnaire = {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  answers: Record<string, string>;
  createdAt: Date;
};

export const questionnaireColumns: ColumnDef<Questionnaire>[] = [
  {
    accessorKey: "id",
    header: "Questionnaire #",
    cell: ({ row }) => {
      const id = row.getValue("id") as string;
      const shortId = id.slice(-6).toUpperCase();
      return <div className="font-medium">#{shortId}</div>;
    },
  },
  {
    accessorKey: "user.name",
    header: "User",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "answers",
    header: "Responses",
    cell: ({ row }) => {
      const answers = row.getValue("answers") as Record<string, string>;
      return (
        <div className="space-y-1">
          {Object.entries(answers).map(([question, answer]) => (
            <div key={question}>
              <p className="font-medium">{question}</p>
              <p className="text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Submitted",
    cell: ({ row }) => format(new Date(row.getValue("createdAt")), "PPp"),
  },
]; 