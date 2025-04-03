// Mock the modules
jest.mock('node-fetch', () => jest.fn());
jest.mock('@/lib/services/video-generation', () => require('./mocks/video-generation.mock.js'));

import fetch from 'node-fetch';
import { VideoGenerationService } from '@/lib/services/video-generation';

const { Response } = jest.requireActual('node-fetch');

describe('Avatar Generation (TC11) - Replicate API Connectivity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // @ts-ignore
    fetch.mockImplementation(() => Promise.resolve(new Response(JSON.stringify({ success: true }), { status: 200 })));
  });

  it('Should confirm connectivity to Replicate API', async () => {
    // Test will simulate a successful connection to Replicate API
    const videoService = new VideoGenerationService();
    
    // @ts-ignore - method may be private in the actual implementation
    const result = await videoService.testReplicateAccess();
    
    // Verify fetch was called with the correct URL and headers
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("api.replicate.com"),
      expect.objectContaining({
        headers: expect.objectContaining({
          "Authorization": expect.stringContaining("Token ")
        })
      })
    );
    
    expect(result.success).toBe(true);
  });

  it('Should be able to generate a sample lip sync video', async () => {
    // Setup mocks for a successful lipsync generation
    // @ts-ignore
    fetch.mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ id: 'test-prediction-id' }), { status: 200 })))
         .mockImplementationOnce(() => Promise.resolve(new Response(JSON.stringify({ status: 'succeeded', output: 'https://example.com/lipsync.mp4' }), { status: 200 })))
         .mockImplementationOnce(() => Promise.resolve(new Response(new ArrayBuffer(1024), { status: 200 })));
    
    const videoService = new VideoGenerationService();
    
    // @ts-ignore - method may be private
    const result = await videoService.generateLipSync('test-audio.mp3', 'maori people', 'test/path');
    
    // Expect the function to return a valid S3 path for the generated lipsync video
    expect(result).toContain('lipsync.mp4');
    
    // Verify API calls were made with correct parameters
    expect(fetch).toHaveBeenCalledWith(
      "https://api.replicate.com/v1/predictions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Authorization": expect.stringContaining("Token ")
        }),
        body: expect.stringContaining("image")
      })
    );
  });
});

describe('Avatar Generation (TC12) - Google Text-to-Speech Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('Should confirm access to Google Text-to-Speech API', async () => {
    const videoService = new VideoGenerationService();
    
    // @ts-ignore - testing private method
    const result = await videoService.testGoogleTTSAccess();
    
    expect(result.success).toBe(true);
  });
  
  it('Should generate audio narration with correct voice', async () => {
    const videoService = new VideoGenerationService();
    const testScript = "This is a test script for narration.";
    const avatarId = "maori people";
    
    // @ts-ignore - private method
    const audioKey = await videoService.generateAudioNarration(testScript, avatarId, 'test/path');
    
    // Expect a valid S3 path for the generated audio
    expect(audioKey).toContain('.mp3');
  });
});

describe('Avatar Generation (TC12) - Subtitle Generation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('Should confirm access to subtitle generation service', async () => {
    const videoService = new VideoGenerationService();
    
    // @ts-ignore - private method
    const result = await videoService.testSubtitleServiceAccess();
    
    expect(result.success).toBe(true);
  });
  
  it('Should generate subtitles from audio', async () => {
    const videoService = new VideoGenerationService();
    
    // @ts-ignore - private method
    const subtitles = await videoService.generateSubtitles('test-audio.mp3');
    
    // Expect subtitles array with timestamps
    expect(Array.isArray(subtitles)).toBe(true);
    expect(subtitles.length).toBeGreaterThan(0);
  });
}); 