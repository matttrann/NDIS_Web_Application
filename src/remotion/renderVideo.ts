import { bundle } from '@remotion/bundler';
import { renderMedia, getCompositions } from '@remotion/renderer';
import path from 'path';

export async function renderFinalVideo({
  lipsyncPath,
  frameKeys,
  audioPath,
  srtPath,
  outputPath,
  s3Client,
  bucketName
}) {
  // Get signed URLs for all assets
  const [lipsyncUrl, audioUrl, srtContent] = await Promise.all([
    getSignedUrl(s3Client, bucketName, lipsyncPath),
    getSignedUrl(s3Client, bucketName, audioPath),
    getSrtContent(s3Client, bucketName, srtPath)
  ]);
  
  const frameUrls = await Promise.all(
    frameKeys.map(key => getSignedUrl(s3Client, bucketName, key))
  );

  // Bundle the composition
  const bundled = await bundle(path.join(process.cwd(), 'src/remotion/StoryVideo.tsx'));
  
  // Get the composition
  const compositions = await getCompositions(bundled);
  const composition = compositions.find((c) => c.id === 'StoryVideo');
  
  if (!composition) {
    throw new Error('Could not find composition');
  }

  // Render video
  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: {
      lipsyncVideoUrl: lipsyncUrl,
      frameUrls,
      audioUrl,
      srtContent,
      duration: composition.durationInFrames / composition.fps,
    },
  });
} 