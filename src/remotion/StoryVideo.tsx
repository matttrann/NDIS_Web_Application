import { AbsoluteFill, useCurrentFrame, Img, Audio, Video, interpolate, useVideoConfig } from 'remotion';
import { parseSRT, getCurrentCaption } from '../utils/srtParser';

interface StoryVideoProps {
  lipsyncVideoUrl: string;
  frameUrls: string[];
  audioUrl: string;
  srtContent: string;
  durationInFrames: number;
}

export const StoryVideo: React.FC<StoryVideoProps> = ({
  lipsyncVideoUrl,
  frameUrls,
  audioUrl,
  srtContent,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // Parse SRT content
  const captions = parseSRT(srtContent);
  const currentCaption = getCurrentCaption(frame, captions);
  
  // Calculate frame transitions based on total duration
  // Each frame should be shown for equal duration throughout the video
  const frameDuration = Math.floor(durationInFrames / frameUrls.length);
  const currentFrameIndex = Math.min(
    Math.floor(frame / frameDuration),
    frameUrls.length - 1
  );
  
  // Smoother transition between frames
  const transitionDuration = Math.min(frameDuration * 0.2, 15); // 20% of frame duration or 15 frames, whichever is less
  const opacity = interpolate(
    frame % frameDuration,
    [0, transitionDuration, frameDuration - transitionDuration, frameDuration],
    [1, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  return (
    <AbsoluteFill>
      {/* Background frames/slideshow */}
      <AbsoluteFill style={{ backgroundColor: 'black' }}>
        {/* Current frame */}
        <Img 
          src={frameUrls[currentFrameIndex]} 
          style={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: opacity 
          }} 
        />
        {/* Next frame (for smooth transition) */}
        {currentFrameIndex < frameUrls.length - 1 && (
          <Img 
            src={frameUrls[currentFrameIndex + 1]} 
            style={{ 
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 1 - opacity 
            }} 
          />
        )}
      </AbsoluteFill>
      
      {/* Lipsync video in corner */}
      <div style={{
        position: 'absolute',
        right: 40,
        bottom: 40,
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        overflow: 'hidden',
        boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
        border: '4px solid white'
      }}>
        <Video 
          src={lipsyncVideoUrl} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover'
          }}
          muted
        />
      </div>
      
      {/* Captions */}
      {currentCaption && (
        <div style={{
          position: 'absolute',
          bottom: 100,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '15px 25px',
          borderRadius: 12,
          color: 'white',
          fontSize: 28,
          textAlign: 'center',
          maxWidth: '70%',
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
        }}>
          {currentCaption}
        </div>
      )}
      
      {/* Audio track */}
      <Audio src={audioUrl} />
    </AbsoluteFill>
  );
};

export default StoryVideo; 