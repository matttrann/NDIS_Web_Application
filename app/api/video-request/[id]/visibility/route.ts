import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isVisible } = await req.json();
    console.log(`Updating visibility for video ${params.id} to ${isVisible}`);

    const videoRequest = await db.videoRequest.update({
      where: { id: params.id },
      data: { 
        isVisible: isVisible 
      },
      select: {
        id: true,
        isVisible: true
      }
    });

    console.log('Updated video request:', videoRequest);

    return NextResponse.json(videoRequest);
  } catch (error) {
    console.error("Error updating video visibility:", error);
    return new NextResponse(JSON.stringify({ 
      error: "Failed to update video visibility",
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 