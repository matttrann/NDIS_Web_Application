import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { z } from "zod";

const descriptionSchema = z.object({
  description: z.string().max(500).optional(),
});

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { description } = descriptionSchema.parse(json);

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        description,
      },
    });

    return NextResponse.json({
      success: true,
      description: updatedUser.description,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error updating user description:", error);
    return NextResponse.json(
      { error: "Failed to update description" },
      { status: 500 }
    );
  }
} 