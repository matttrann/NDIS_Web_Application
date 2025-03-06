import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId, answers } = await req.json();
    
    // Add more specific validation
    if (!userId || typeof answers !== 'object' || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const createdQuestionnaire = await db.questionnaire.create({
      data: {
        userId,
        answers,
      },
    });

    return NextResponse.json({ success: true, data: createdQuestionnaire });

  } catch (error) {
    console.error("Database error:", error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error", code: error.code, meta: error.meta },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
