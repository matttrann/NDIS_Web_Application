import { PrismaClient } from '@prisma/client';
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { config } from 'dotenv';

// Load environment variables
config();

const prisma = new PrismaClient();
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

async function checkS3ObjectExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

async function updateTestVideoPath(videoRequestId: string) {
  try {
    // Construct the expected S3 path
    const expectedPath = `video-requests/${videoRequestId}/final_test.mp4`;
    
    // Check if the file exists in S3
    const exists = await checkS3ObjectExists(expectedPath);
    
    if (!exists) {
      console.error(`Video file not found in S3: ${expectedPath}`);
      return false;
    }

    // Update the database record
    const updatedRequest = await prisma.videoRequest.update({
      where: { id: videoRequestId },
      data: { 
        testVideoPath: expectedPath,
        // Optionally update status if needed
        // status: "test_video_ready"
      },
    });

    console.log(`Successfully updated video request ${videoRequestId} with test video path`);
    return true;
  } catch (error) {
    console.error(`Error updating video request ${videoRequestId}:`, error);
    return false;
  }
}

// Main function to handle single or multiple video requests
async function main() {
  try {
    const videoRequestId = process.argv[2];

    if (videoRequestId) {
      // Update single video request
      await updateTestVideoPath(videoRequestId);
    } else {
      // Update all video requests that don't have a testVideoPath
      const requests = await prisma.videoRequest.findMany({
        where: {
          testVideoPath: null,
        },
        select: {
          id: true
        }
      });

      console.log(`Found ${requests.length} video requests without test video paths`);

      for (const request of requests) {
        const success = await updateTestVideoPath(request.id);
        if (success) {
          console.log(`✓ Updated ${request.id}`);
        } else {
          console.log(`✗ Failed to update ${request.id}`);
        }
      }
    }
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 