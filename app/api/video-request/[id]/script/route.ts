import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { VideoGenerationService } from "@/lib/services/video-generation";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { script, action } = await req.json();

    const videoRequest = await db.videoRequest.findUnique({
      where: { id: params.id },
    });

    if (!videoRequest) {
      return new NextResponse("Video request not found", { status: 404 });
    }

    if (action === "approve") {
      // Update script if modified and mark as approved
      await db.videoRequest.update({
        where: { id: params.id },
        data: {
          script: script, // Update with potentially modified script
          status: "script_approved"
        }
      });

      // Continue with video generation
      const videoService = new VideoGenerationService();
      videoService.continueVideoGeneration(params.id)
        .catch((error) => {
          console.error("Video generation error:", error);
          db.videoRequest.update({
            where: { id: params.id },
            data: { status: "failed" }
          });
        });

      return NextResponse.json({ message: "Script approved and video generation started" });
    } else if (action === "reject") {
      await db.videoRequest.update({
        where: { id: params.id },
        data: { status: "script_rejected" }
      });
      return NextResponse.json({ message: "Script rejected" });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("Script approval error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 