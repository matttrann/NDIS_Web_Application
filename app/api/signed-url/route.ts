import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");

    if (!key) {
      return new NextResponse("Missing key parameter", { status: 400 });
    }

    // Extract video request ID from the key (assuming format: video-requests/{requestId}/...)
    const matches = key.match(/video-requests\/([^\/]+)/);
    const videoRequestId = matches ? matches[1] : null;

    if (!videoRequestId) {
      return new NextResponse("Invalid video path", { status: 400 });
    }

    // Check if the user has access to this video
    const videoRequest = await db.videoRequest.findUnique({
      where: {
        id: videoRequestId,
      },
      select: {
        userId: true,
        isVisible: true,
      },
    });

    // Allow access if:
    // 1. User is an admin, OR
    // 2. User owns the video AND the video is marked as visible
    const hasAccess = 
      user.role === "ADMIN" || 
      (videoRequest?.userId === user.id && videoRequest?.isVisible);

    if (!videoRequest || !hasAccess) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 