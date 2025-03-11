import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";
import { getSignedUrl as getCloudFrontSignedUrl } from "@aws-sdk/cloudfront-signer";

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

    // CLOUDFRONT IMPLEMENTATION: Generate a signed CloudFront URL instead of S3 URL
    const cloudFrontDomain = process.env.CLOUDFRONT_DOMAIN!;
    const url = `https://${cloudFrontDomain}/${key}`;
    
    // Set expiration time (e.g., 1 hour from now)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);
    
    const signedUrl = getCloudFrontSignedUrl({
      url,
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID!,
      dateLessThan: expiry.toISOString(),
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!
    });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 