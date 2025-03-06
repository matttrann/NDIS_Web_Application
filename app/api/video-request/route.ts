import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { questionnaireId, storytellerId } = await req.json();

    // Validate inputs
    if (!questionnaireId || !storytellerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify questionnaire belongs to user
    const questionnaire = await db.questionnaire.findFirst({
      where: {
        id: questionnaireId,
        userId: user.id,
      },
    });

    if (!questionnaire) {
      return NextResponse.json(
        { error: "Questionnaire not found" },
        { status: 404 }
      );
    }

    // Create video request
    const videoRequest = await db.videoRequest.create({
      data: {
        userId: user.id,
        questionnaireId,
        storytellerId,
        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      data: videoRequest,
    });

  } catch (error) {
    console.error("Video request creation error:", error);
    return NextResponse.json(
      { error: "Failed to create video request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const videoRequests = await db.videoRequest.findMany({
      select: {
        id: true,
        userId: true,
        questionnaireId: true,
        storytellerId: true,
        status: true,
        script: true,
        testVideoPath: true,
        s3BasePath: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        questionnaire: {
          select: {
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(videoRequests);
  } catch (error) {
    console.error("Error fetching video requests:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 