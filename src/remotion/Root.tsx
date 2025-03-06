import { Composition } from 'remotion';
import { StoryVideo } from './StoryVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StoryVideo"
        component={StoryVideo}
        durationInFrames={450} // Default 15 seconds, will be overridden
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          lipsyncVideoUrl: '',
          frameUrls: [],
          audioUrl: '',
          srtContent: '',
          durationInFrames: 450,
        }}
      />
    </>
  );
}; 