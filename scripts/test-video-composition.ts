import { execSync } from 'child_process';
import { config } from 'dotenv';
import { bundle } from '@remotion/bundler';
import { renderMedia, getCompositions } from '@remotion/renderer';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import path from 'path';
import fs from 'fs';
import os from 'os';
import https from 'https';
import { PrismaClient } from '@prisma/client';

// Load environment variables
config();

// Verify AWS configuration
const requiredEnvVars = [
  'AWS_REGION',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AWS_BUCKET_NAME'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

console.log('Using AWS Region:', process.env.AWS_REGION);
console.log('Using S3 Bucket:', process.env.AWS_BUCKET_NAME);

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

async function getSignedS3Url(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

async function getSrtContent(key: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });
  const response = await s3Client.send(command);
  const content = await response.Body?.transformToString();
  if (!content) throw new Error('Failed to get SRT content');
  return content;
}

// Function to download file temporarily
async function downloadFile(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const fileStream = fs.createWriteStream(outputPath);
      response.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// Function to get video duration using ffprobe
async function getVideoDuration(videoUrl: string): Promise<number> {
  const tempPath = path.join(os.tmpdir(), 'temp_video.mp4');
  
  try {
    // Download the video temporarily
    await downloadFile(videoUrl, tempPath);
    
    // Get duration using ffprobe
    const ffprobeOutput = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${tempPath}"`);
    const durationInSeconds = parseFloat(ffprobeOutput.toString());
    
    // Clean up temp file
    fs.unlinkSync(tempPath);
    
    return durationInSeconds;
  } catch (error) {
    console.error('Error getting video duration:', error);
    // If ffprobe fails, return a default duration of 15 seconds
    return 15;
  }
}

// Add this function to count available frames
async function countAvailableFrames(basePath: string): Promise<number> {
  let frameCount = 0;
  let frameExists = true;
  
  while (frameExists && frameCount < 30) { // Set a reasonable upper limit
    const frameKey = `${basePath}/frames/frame_${frameCount.toString().padStart(4, '0')}.png`;
    
    try {
      // Just check if the frame exists
      await s3Client.send(new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: frameKey
      }));
      frameCount++;
    } catch (error) {
      // Frame doesn't exist
      frameExists = false;
    }
  }
  
  // Ensure we have at least one frame
  return Math.max(frameCount, 1);
}

async function testVideoComposition(videoRequestId: string) {
  try {
    const s3BasePath = `video-requests/${videoRequestId}`;
    
    // Get signed URLs for all assets
    const [lipsyncUrl, audioUrl, srtContent] = await Promise.all([
      getSignedS3Url(`${s3BasePath}/lipsync.mp4`),
      getSignedS3Url(`${s3BasePath}/audio.mp3`),
      getSrtContent(`${s3BasePath}/captions.srt`)
    ]);

    // First determine how many frames exist
    console.log('Checking how many frames are available...');
    const frameCount = await countAvailableFrames(s3BasePath);
    console.log(`Found ${frameCount} frames for video composition`);

    // Now get URLs only for frames that exist
    const frameUrls = await Promise.all(
      Array.from({ length: frameCount }, (_, i) => 
        getSignedS3Url(`${s3BasePath}/frames/frame_${i.toString().padStart(4, '0')}.png`)
      )
    );

    console.log('Got signed URLs for all assets');

    // Get video duration
    const durationInSeconds = await getVideoDuration(lipsyncUrl);
    const durationInFrames = Math.floor(durationInSeconds * 30); // 30 fps

    console.log(`Video duration: ${durationInSeconds} seconds (${durationInFrames} frames)`);

    // Bundle the composition
    const bundled = await bundle(path.join(process.cwd(), 'src/remotion/index.tsx'));
    console.log('Bundled composition');

    // Get the composition details
    const comps = await getCompositions(bundled, {
      inputProps: {
        lipsyncVideoUrl: lipsyncUrl,
        frameUrls,
        audioUrl,
        srtContent,
        durationInFrames,
      },
    });
    const composition = comps.find((c) => c.id === 'StoryVideo');
    
    if (!composition) {
      throw new Error('Could not find composition');
    }

    // Render video
    const outputPath = path.join(os.tmpdir(), `${videoRequestId}_final.mp4`);
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
      },
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        lipsyncVideoUrl: lipsyncUrl,
        frameUrls,
        audioUrl,
        srtContent,
        durationInFrames,
      },
    });

    console.log('Video rendered successfully');

    // Upload to S3
    const outputKey = `${s3BasePath}/final_test.mp4`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: outputKey,
      Body: fs.readFileSync(outputPath),
      ContentType: 'video/mp4',
    });
    await s3Client.send(command);

    // Clean up
    fs.unlinkSync(outputPath);

    // Update the VideoRequest record with the test video path
    const prisma = new PrismaClient();
    
    try {
      // Add logging to verify the data we're trying to update
      console.log('Video request ID:', videoRequestId);
      console.log('Test video path to save:', outputKey);

      // First check if the record exists
      const existingRequest = await prisma.videoRequest.findUnique({
        where: { id: videoRequestId },
      });
      
      if (!existingRequest) {
        throw new Error(`Video request not found with ID: ${videoRequestId}`);
      }
      
      console.log('Found existing video request:', existingRequest);

      // Perform the update
      const updatedRequest = await prisma.videoRequest.update({
        where: { id: videoRequestId },
        data: { 
          testVideoPath: outputKey,
          // Also update the status to indicate test video is ready
          status: "test_video_ready" 
        },
      });
      
      console.log('Successfully updated VideoRequest. New data:', updatedRequest);
    } catch (error) {
      console.error('Database update error details:', {
        error,
        videoRequestId,
        outputKey,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    } finally {
      await prisma.$disconnect();
    }

    console.log('Test completed successfully!');
    console.log('Output video:', outputKey);

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

// Run the test if called directly
if (require.main === module) {
  const videoRequestId = process.argv[2];
  if (!videoRequestId) {
    console.error('Please provide a video request ID');
    process.exit(1);
  }

  testVideoComposition(videoRequestId)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 