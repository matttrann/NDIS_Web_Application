import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { VideoGenerationService } from "@/lib/services/video-generation";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Auth check
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Get request body
    const { status } = await req.json();
    console.log(`Updating video request ${params.id} to status: ${status}`);

    // 3. Update request status
    const videoRequest = await db.videoRequest.update({
      where: { id: params.id },
      data: { status },
      include: {
        questionnaire: true // Include questionnaire data
      }
    });

    // 4. Trigger video generation only when approved
    if (status === "approved") {
      console.log('Starting video generation process...');
      const videoService = new VideoGenerationService();
      
      // Process in background but with error logging
      videoService.processVideoRequest(params.id)
        .then(() => {
          console.log(`Video generation completed for request ${params.id}`);
        })
        .catch((error) => {
          console.error("Video generation error details:", {
            requestId: params.id,
            error: error.message,
            stack: error.stack
          });
          // Update status to failed if there's an error
          db.videoRequest.update({
            where: { id: params.id },
            data: { status: "failed" },
          });
        });

      // Return success immediately since processing continues in background
      return NextResponse.json({
        ...videoRequest,
        message: "Video generation started"
      });
    }

    return NextResponse.json(videoRequest);
  } catch (error) {
    console.error("API error details:", {
      endpoint: `/api/video-request/${params.id}`,
      method: 'PATCH',
      error: error.message,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: "Failed to update video request", details: error.message },
      { status: 500 }
    );
  }
}
