import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const questionnaire = await db.questionnaire.findUnique({
      where: { id: params.id, userId: user.id },
      include: { user: true }
    });

    return NextResponse.json(questionnaire?.answers);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch questionnaire" },
      { status: 500 }
    );
  }
} 