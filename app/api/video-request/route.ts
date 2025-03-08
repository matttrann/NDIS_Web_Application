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

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get pagination parameters from URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const hasTestVideo = searchParams.get("hasTestVideo") === "true";
    const skip = (page - 1) * pageSize;

    // Build where clause
    const where = hasTestVideo ? {
      testVideoPath: {
        not: null
      }
    } : {};

    // Get total count for pagination
    const totalCount = await db.videoRequest.count({ where });

    // Get paginated data
    const videoRequests = await db.videoRequest.findMany({
      where,
      select: {
        id: true,
        userId: true,
        questionnaireId: true,
        testVideoPath: true,
        status: true,
        script: true,
        createdAt: true,
        updatedAt: true,
        storytellerId: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
    });

    return NextResponse.json({
      data: videoRequests,
      metadata: {
        totalCount,
        pageCount: Math.ceil(totalCount / pageSize),
        currentPage: page,
        pageSize,
      }
    });
  } catch (error) {
    console.error("Error fetching video requests:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 