import { TextToSpeechClient } from '@google-cloud/text-to-speech';

const client = new TextToSpeechClient();

export async function synthesizeSpeech(text: string, voice = 'en-AU-Wavenet-D') {
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'en-AU',
      name: voice,
    },
    audioConfig: { audioEncoding: 'MP3' },
  });

  return {
    audioContent: response.audioContent,
    voice,
  };
}
