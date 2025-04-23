// Mock the VideoGenerationService
const fetch = require('node-fetch');

class MockVideoGenerationService {
  constructor() {
    this.s3Client = {
      send: jest.fn().mockResolvedValue({ success: true })
    };
  }

  // Replicate API Access Test
  testReplicateAccess() {
    // Call fetch to ensure the mock function is called for test verification
    fetch("https://api.replicate.com/v1/models", {
      headers: {
        "Authorization": "Token test-token"
      }
    });
    
    return Promise.resolve({
      success: true,
      versionId: "test-version-id"
    });
  }

  // Lipsync generation
  generateLipSync(audioKey, storytellerId, basePath) {
    // Call fetch to ensure the mock function is called for test verification
    fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": "Token test-token"
      },
      body: JSON.stringify({
        version: "test-version",
        input: {
          image: "test-image",
          audio: audioKey
        }
      })
    });
    
    return Promise.resolve(`${basePath}/lipsync.mp4`);
  }

  // Google TTS Access Test
  testGoogleTTSAccess() {
    return Promise.resolve({
      success: true
    });
  }

  // Audio narration generation
  generateAudioNarration(script, avatarId, basePath) {
    return Promise.resolve(`${basePath}/audio.mp3`);
  }

  // Subtitle service access test
  testSubtitleServiceAccess() {
    return Promise.resolve({
      success: true
    });
  }

  // Subtitle generation
  generateSubtitles(audioPath) {
    return Promise.resolve([
      {
        start: 0,
        end: 2,
        text: "This is a test subtitle."
      },
      {
        start: 2,
        end: 4, 
        text: "It has multiple entries."
      }
    ]);
  }

  // Full video generation
  generateVideo(request) {
    return Promise.resolve({
      videoKey: "test-video-key",
      videoUrl: "https://example.com/test-video.mp4"
    });
  }
}

module.exports = {
  VideoGenerationService: MockVideoGenerationService
}; 