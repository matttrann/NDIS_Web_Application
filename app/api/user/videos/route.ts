import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const videos = await db.videoRequest.findMany({
      where: {
        userId: user.id,
        testVideoPath: { not: null },
        isVisible: true,
        // Make sure the video is completed
        status: "completed"
      },
      select: {
        id: true,
        testVideoPath: true,
        createdAt: true,
        storytellerId: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching user videos:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 