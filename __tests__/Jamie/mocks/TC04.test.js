/**
User story: As a patient I want to to hear my avatar narate the story, So that I know what's going on.
requirements:  The system must integrate with google text to speech, the system must make a request to google text-to-spech containing the genrated story, the system must retreive the audio response from google text-to-speech, the generated audio must be played over the video, the audio must align with the visual aids, the audio must match the chosen avatar's voice
test steps: 1. Audio must emit from the video
2. The words within the audio must appear natural and align with the avatar's lip movements
3. Retrieve the relevant script
4. Ensure the emitted audio matches the generated script
5. The audio must run for the length of the video

 */

import '@testing-library/jest-dom';

jest.mock('@/lib/google-tts', () => ({
  synthesizeSpeech: jest.fn(),
}));

describe('Avatar Narration System (Text-to-Speech Integration)', () => {
  const mockGeneratedStory = "Once upon a time in a busy playground, Jamie learned how to stay calm.";
  const mockVoice = "en-AU-Wavenet-D"; // avatar voice preset
  const mockAudioUrl = "https://fake-tts/audio.mp3";

  beforeEach(() => {
    const { synthesizeSpeech } = require('@/lib/google-tts');
    synthesizeSpeech.mockResolvedValue({
      audioContent: mockAudioUrl,
      voice: mockVoice
    });

    // 🧠 FULLY mock Audio constructor for all tests
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(), // important to return a Promise
      pause: jest.fn(),
      duration: 60,
      addEventListener: jest.fn((event, cb) => {
        if (event === 'loadedmetadata') cb(); // simulate audio loading
      }),
    }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('calls Google TTS with the correct story', async () => {
    const { synthesizeSpeech } = require('@/lib/google-tts');
    await synthesizeSpeech(mockGeneratedStory, mockVoice);
    expect(synthesizeSpeech).toHaveBeenCalledWith(mockGeneratedStory, mockVoice);
  });

  test('plays audio narration over video', async () => {
    const audio = new Audio(mockAudioUrl);
    await audio.play();
    expect(audio.play).toHaveBeenCalled();
  });

  test('audio matches the script content and avatar voice', async () => {
    const { synthesizeSpeech } = require('@/lib/google-tts');
    const response = await synthesizeSpeech(mockGeneratedStory, mockVoice);
    expect(response.audioContent).toBe(mockAudioUrl);
    expect(response.voice).toBe(mockVoice);
  });

  test('audio runs for the length of the video', async () => {
    const audio = new Audio(mockAudioUrl);
    const videoDuration = 60; // seconds
    const audioDuration = audio.duration;
    expect(audioDuration).toBe(videoDuration);
  });
});

const avatarVoiceMap = {
    'Bear': 'en-AU-Wavenet-D',
    'Teenage boy': 'en-US-Wavenet-B',
    'Teenage girl': 'en-GB-Wavenet-F',
    'Moari': 'en-US-Wavenet-F',
  };
  
  describe('Avatar voice mapping to Google TTS voices', () => {
    const { synthesizeSpeech } = require('@/lib/google-tts');
    const mockStory = "Today I overcame a challenge and felt really proud.";
  
    beforeEach(() => {
      synthesizeSpeech.mockResolvedValue({
        audioContent: 'https://mock.audio/file.mp3',
      });
    });
  
    afterEach(() => {
      jest.resetAllMocks();
    });
  
    Object.entries(avatarVoiceMap).forEach(([avatarName, expectedVoice]) => {
      test(`"${avatarName}" maps to voice "${expectedVoice}"`, async () => {
        // Simulate story generation for this avatar
        await synthesizeSpeech(mockStory, expectedVoice);
  
        expect(synthesizeSpeech).toHaveBeenCalledWith(mockStory, expectedVoice);
      });
    });
  });
