"use client";

import { useState, useTransition } from "react";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionColumns } from "@/components/dashboard/section-columns";
import { Icons } from "@/components/shared/icons";

// Validation schema
const adminDescriptionSchema = z.object({
  description: z.string().max(500, "Description must be 500 characters or less").optional(),
});

type FormData = z.infer<typeof adminDescriptionSchema>;

interface AdminDescriptionFormProps {
  user: Pick<User, "id" | "description">;
}

export function AdminDescriptionForm({ user }: AdminDescriptionFormProps) {
  const [updated, setUpdated] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(adminDescriptionSchema),
    defaultValues: {
      description: user?.description || "",
    },
  });

  const checkUpdate = (value) => {
    setUpdated(user.description !== value);
  };

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const response = await fetch('/api/users/description', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: data.description }),
      });

      if (!response.ok) {
        toast.error("Something went wrong.", {
          description: "Your description was not updated. Please try again.",
        });
      } else {
        setUpdated(false);
        toast.success("Your description has been updated.");
      }
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionColumns
        title="Admin Description"
        description="Add a description about yourself that will be visible to users when they request admin access."
      >
        <div className="flex w-full flex-col gap-2">
          <Label htmlFor="description">
            Description
          </Label>
          <Textarea
            id="description"
            className="min-h-32 flex-1"
            placeholder="Tell users a bit about what you do and how you can help them..."
            {...register("description")}
            onChange={(e) => checkUpdate(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <div>
              {errors?.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">Max 500 characters</p>
            </div>
            <Button
              type="submit"
              variant={updated ? "default" : "disable"}
              disabled={isPending || !updated}
            >
              {isPending ? (
                <Icons.spinner className="size-4 animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </SectionColumns>
    </form>
  );
} 