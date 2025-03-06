import { GoogleGenerativeAI } from "@google/generative-ai";
import { S3Client, PutObjectCommand, GetObjectCommand, PutObjectAclCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { storytellers } from "@/config/storytellers";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { spawn } from 'child_process';

interface VoiceConfig {
  languageCode: string;
  name: string;
  ssmlGender: 'MALE' | 'FEMALE';
  speakingRate?: number;
  pitch?: number;
}

export class VideoGenerationService {
  private genAI: GoogleGenerativeAI;
  private s3Client: S3Client;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
  }

  async processVideoRequest(requestId: string) {
    try {
      const request = await db.videoRequest.findUnique({
        where: { id: requestId },
        include: {
          questionnaire: true,
        },
      });

      if (!request) {
        throw new Error("Video request not found");
      }

      // Update status to processing
      await this.updateRequestStatus(requestId, "processing");

      // 1. Generate script
      const scriptStartTime = performance.now();
      console.log('Starting script generation...');
      const script = await this.generateScript(request.questionnaire.answers);
      
      // Store script and update status for admin review
      await db.videoRequest.update({
        where: { id: requestId },
        data: { 
          script,
          status: "script_pending_review" 
        },
      });

      // Stop here and wait for admin approval
      return;
    } catch (error) {
      console.error("Script generation error:", error);
      await this.updateRequestStatus(requestId, "failed");
      throw error;
    }
  }

  private async generateScript(questionnaireData: any) {
    const model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash"  // Updated model name
    });
    const prompt = `Create a very short, completely safe and child-friendly therapeutic story for an NDIS patient based on these questionnaire responses: ${JSON.stringify(questionnaireData)}. 

ROLE: You are creating content for young children's educational television.

STORY REQUIREMENTS:
- Length: Maximum 100 words (for 30-second narration)
- Target audience: Young children (ages 4-10)
- Theme: Simple positive message or basic life skill
- Content: Must be G-rated, absolutely safe for children

MANDATORY CONTENT RULES:
- Only use these safe settings: park, garden, classroom, playground
- Only these safe activities: playing, learning, sharing, helping
- Only these safe characters: children, teachers, parents, friendly animals
- Only these emotions: happy, curious, kind, gentle
- Only daytime scenes
- No conflict stronger than "learning to share" or "making new friends"

FORBIDDEN CONTENT (STRICT):
- No negative emotions
- No physical contact
- No dangerous situations
- No scary elements
- No medical references
- No strangers
- No risky behaviors
- No water scenes
- No height-related scenes
- No food-related conflicts

STRUCTURE:
1. Safe setting introduction (1 sentence)
2. Simple positive situation (1-2 sentences)
3. Gentle learning moment (1 sentence)
4. Happy ending (1 sentence)

STYLE:
- Use extremely simple, clear language
- Keep everything bright and cheerful
- Focus on friendship and kindness
- Use only safe, common objects
- Describe only gentle actions

EXAMPLE SAFE TOPICS:
- Learning to share toys in a classroom
- Making friends in a playground
- Being kind to others in a park
- Helping in a garden
- Learning something new at school

IMPORTANT: 
- Story MUST be under 100 words
- Every element must be completely safe and non-threatening
- Think "Playschool" or "Bluey" level of content safety`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  private async updateRequestStatus(requestId: string, status: string) {
    return db.videoRequest.update({
      where: { id: requestId },
      data: { status },
    });
  }

  private getVoiceConfig(storytellerId: string): VoiceConfig {
    // Map storyteller IDs to Google TTS voices
    const voiceMap: Record<string, VoiceConfig> = {
      // Male voices
      'top g': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-B',
        ssmlGender: 'MALE',
        pitch: -2,  // Deeper voice
        speakingRate: 0.9
      },
      'la flame': {
        languageCode: 'en-US',
        name: 'en-US-Standard-D',
        ssmlGender: 'MALE',
        pitch: -1
      },
      'ronaldo': {
        languageCode: 'en-GB',
        name: 'en-GB-Standard-B',
        ssmlGender: 'MALE',
        pitch: 0
      },
      'ishowspeed': {
        languageCode: 'en-US',
        name: 'en-US-Standard-A',
        ssmlGender: 'MALE',
        speakingRate: 1.1
      },
      
      // Female voices
      'sydney sweeney': {
        languageCode: 'en-US',
        name: 'en-US-Standard-F',
        ssmlGender: 'FEMALE',
        pitch: 2
      },
      'kim kardashian': {
        languageCode: 'en-US',
        name: 'en-US-Standard-H',
        ssmlGender: 'FEMALE',
        speakingRate: 0.9
      },
      'lisa': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-A',
        ssmlGender: 'FEMALE',
        pitch: 1
      },
      'ironmouse': {
        languageCode: 'en-US',
        name: 'en-US-Standard-E',
        ssmlGender: 'FEMALE',
        pitch: 4,
        speakingRate: 1.1
      },

      // Child voices
      'little girl': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-A',
        ssmlGender: 'FEMALE',
        pitch: 4,
        speakingRate: 1.1
      },
      'little boy': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-B',
        ssmlGender: 'MALE',
        pitch: 3,
        speakingRate: 1.1
      },
      'adolescent girl': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-A',
        ssmlGender: 'FEMALE',
        pitch: 2
      },
      'adolescent boy': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-B',
        ssmlGender: 'MALE',
        pitch: 1
      },

      // Animals (using different accents and pitches)
      'koala': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-A',
        ssmlGender: 'FEMALE',
        pitch: 1,
        speakingRate: 0.9
      },
      'kangaroo': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-B',
        ssmlGender: 'MALE',
        pitch: -1,
        speakingRate: 1.1
      },
      'bear': {
        languageCode: 'en-US',
        name: 'en-US-Standard-D',
        ssmlGender: 'MALE',
        pitch: -4,
        speakingRate: 0.9
      },

      // Cultural voices
      'maori people': {
        languageCode: 'en-AU',
        name: 'en-AU-Standard-B',
        ssmlGender: 'MALE',
        pitch: -2,  // Deeper voice
        speakingRate: 0.9
      }
    };

    // Default voice if storyteller not found
    const defaultVoice: VoiceConfig = {
      languageCode: 'en-AU',
      name: 'en-AU-Standard-B',
      ssmlGender: 'MALE'
    };

    return voiceMap[storytellerId] || defaultVoice;
  }

  private async generateAudio(script: string, storytellerId: string): Promise<Buffer> {
    try {
      const voiceConfig = this.getVoiceConfig(storytellerId);
      console.log('Using voice config:', voiceConfig);

      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: script },
          voice: {
            languageCode: voiceConfig.languageCode,
            name: voiceConfig.name,
            ssmlGender: voiceConfig.ssmlGender
          },
          audioConfig: { 
            audioEncoding: 'MP3',
            speakingRate: voiceConfig.speakingRate || 1.0,
            pitch: voiceConfig.pitch || 0
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('TTS API error response:', errorData);
        throw new Error(`TTS API error: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.audioContent) {
        throw new Error('No audio content received from TTS API');
      }

      return Buffer.from(data.audioContent, 'base64');
    } catch (error) {
      console.error('TTS generation error:', error);
      throw new Error(`Failed to generate audio: ${error.message}`);
    }
  }

  private async uploadToS3(key: string, content: Buffer | string, contentType: string = 'text/plain'): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: content,
        ContentType: contentType,
      });

      await this.s3Client.send(command);
      return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error('Failed to upload to S3');
    }
  }

  private async generateCaptions(audioUrl: string): Promise<{ text: string; srt: string }> {
    try {
      console.log('Creating transcript request for:', audioUrl);
      
      const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
        method: 'POST',
        headers: {
          'Authorization': process.env.ASSEMBLYAI_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audio_url: audioUrl,
          auto_chapters: true,
          auto_highlights: true
        }),
      });

      if (!transcriptResponse.ok) {
        const errorData = await transcriptResponse.json();
        console.error('AssemblyAI API error:', errorData);
        throw new Error(`AssemblyAI API error: ${transcriptResponse.statusText}`);
      }

      const transcriptData = await transcriptResponse.json();
      const transcriptId = transcriptData.id;
      console.log('Transcript ID:', transcriptId);

      // Add timeout and polling count
      let attempts = 0;
      const maxAttempts = 30; // 1 minute maximum wait time (2 seconds * 30)
      
      // Poll for completion
      while (attempts < maxAttempts) {
        console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
        const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
          headers: {
            'Authorization': process.env.ASSEMBLYAI_API_KEY!,
          },
        });

        const pollingData = await pollingResponse.json();
        console.log('Transcript status:', pollingData.status);

        if (pollingData.status === 'completed') {
          // Get SRT format
          const srtResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}/srt`, {
            headers: {
              'Authorization': process.env.ASSEMBLYAI_API_KEY!,
            },
          });
          
          if (!srtResponse.ok) {
            throw new Error('Failed to get SRT format');
          }

          const srtData = await srtResponse.text();
          console.log('SRT generated successfully');
          
          return {
            text: pollingData.text,
            srt: srtData
          };
        } else if (pollingData.status === 'error') {
          throw new Error(`AssemblyAI error: ${pollingData.error}`);
        } else if (pollingData.status === 'queued' || pollingData.status === 'processing') {
          // Log more details about the processing status
          console.log(`Processing progress: ${pollingData.percentage_complete}%`);
        }

        // Increment attempts counter
        attempts++;
        
        // Wait 2 seconds before polling again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // If we reach here, we've timed out
      throw new Error('Transcript generation timed out after 60 seconds');
      
    } catch (error) {
      console.error('Caption generation error:', error);
      throw new Error(`Failed to generate captions: ${error.message}`);
    }
  }

  private async generateFrameImages(script: string, basePath: string) {
    // Define frameKeys at function level so catch block can access it
    const frameKeys: string[] = [];
    
    try {
      // Split into key story moments instead of word count
      const sentences = script.split(/[.!?]+/).filter(Boolean);
      const framesContent = sentences.map(s => s.trim());

      console.log(`Generating ${framesContent.length} key story frames`);

      for (let index = 0; index < framesContent.length; index++) {
        let retryCount = 0;
        const maxRetries = 3;
        let success = false;

        while (!success && retryCount < maxRetries) {
          try {
            if (index > 0 || retryCount > 0) {
              await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const content = framesContent[index];
            
            // Enhanced prompt for clearer, story-focused images
            const formattedPrompt = `Create a clear, high-quality children's book illustration:
              Scene description: ${content}
              
              Art style specifications:
              - Clean, crisp 2D digital art like modern Disney/Pixar concept art
              - Bright, vibrant colors with clear outlines
              - Simple, uncluttered backgrounds
              - Clear focus on main characters and actions
              - Daytime setting with soft, natural lighting
              - Child-friendly character designs
              - Expressive, friendly faces
              
              Technical requirements:
              - Sharp, detailed illustration
              - No motion blur or abstract elements
              - Clear foreground and background separation
              - Strong composition with central focus
              - Professional children's book quality
              
              Reference style: Modern Disney animation concept art, Pixar storybook illustrations, high-end children's book art`;

            console.log(`Generating frame ${index + 1}/${framesContent.length} (Attempt ${retryCount + 1}/${maxRetries})`);
            
            const response = await fetch("https://api.replicate.com/v1/predictions", {
              method: "POST",
              headers: {
                "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                version: "c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
                input: {
                  prompt: formattedPrompt,
                  negative_prompt: "motion, blur, movement, action, speed, multiple scenes, collage, abstract, artistic, painterly, textured, grainy, noise, unclear, distorted, multiple frames, animation, video, gif, moving parts",
                  width: 1024,
                  height: 576,
                  scheduler: "DPMSolverMultistep",
                  num_outputs: 1,
                  guidance_scale: 9.0,
                  num_inference_steps: 25,
                  safety_checker: true
                }
              })
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(`Replicate API error: ${response.statusText}. Details: ${JSON.stringify(errorData)}`);
            }

            const prediction = await response.json();
            const imageUrl = await this.waitForReplicateResult(prediction.id);
            
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
              throw new Error(`Failed to download generated image: ${imageResponse.statusText}`);
            }

            const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
            const s3Key = `${basePath}/frames/frame_${index.toString().padStart(4, '0')}.png`;
            await this.uploadToS3(s3Key, imageBuffer, 'image/png');
            
            frameKeys.push(s3Key);
            console.log(`Successfully generated frame ${index + 1}/${framesContent.length}`);
            success = true;

          } catch (error) {
            console.error(`Error generating frame ${index + 1} (Attempt ${retryCount + 1}):`, error);
            retryCount++;
            
            if (retryCount === maxRetries) {
              throw new Error(`Failed to generate frame ${index + 1} after ${maxRetries} attempts`);
            }
            
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }

      await db.videoRequest.update({
        where: { id: basePath.split('/')[1] },
        data: {
          status: "frames_generated",
          frameKeys: frameKeys
        }
      });

      return frameKeys;
    } catch (error) {
      console.error('Frame generation error:', error);
      if (frameKeys.length > 0) {
        await db.videoRequest.update({
          where: { id: basePath.split('/')[1] },
          data: {
            status: "frames_partially_generated",
            frameKeys: frameKeys
          }
        });
      }
      throw new Error(`Failed to generate frames: ${error.message}`);
    }
  }

  private async waitForReplicateResult(predictionId: string): Promise<string> {
    const maxAttempts = 30;
    const delayMs = 2000;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to check prediction status: ${response.statusText}`);
        }

        const prediction = await response.json();
        
        if (prediction.status === "succeeded") {
          return prediction.output[0]; // Return the image URL
        } else if (prediction.status === "failed") {
          throw new Error(`Image generation failed: ${prediction.error}`);
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } catch (error) {
        console.error(`Error checking prediction status:`, error);
        // Continue trying despite errors
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    throw new Error("Image generation timed out");
  }

  private async testReplicateAccess() {
    try {
      // Get the latest MEMO model version
      const modelResponse = await fetch("https://api.replicate.com/v1/models/zsxkib/memo", {
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        }
      });

      if (!modelResponse.ok) {
        console.error("API Access Error:", await modelResponse.json());
        return {
          success: false,
          error: "Cannot access MEMO model"
        };
      }

      // Extract the latest version ID
      const modelData = await modelResponse.json();
      const versionId = modelData.latest_version?.id;
      
      if (!versionId) {
        return {
          success: false,
          error: "Could not find latest version ID"
        };
      }
      
      console.log("Using MEMO version:", versionId);

      // Test prediction with proper parameters
      const testPrediction = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: versionId,
          input: {
            image: "https://replicate.delivery/pbxt/IerVsLbJgNKplCmPnGf32L8IX2zYy1QdKtRJZJGnYmPEDziH/face.jpg",
            audio: "https://replicate.delivery/pbxt/J3Qf5c3a9dTlWG0YOQhYChN5LC6dbWKZUuYTWMQKmYtMXITjA/speech.mp3"
          }
        })
      });

      if (!testPrediction.ok) {
        console.error("Test prediction failed:", await testPrediction.json());
        return {
          success: false,
          error: "Test prediction creation failed"
        };
      }

      return {
        success: true,
        message: "API access verified",
        versionId: versionId
      };

    } catch (error) {
      console.error("Replicate API test failed:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async generateLipSync(audioKey: string, storytellerId: string, basePath: string) {
    try {
      const accessTest = await this.testReplicateAccess();
      if (!accessTest?.success) {
        throw new Error(`Replicate API test failed: ${accessTest?.error || 'Unknown error'}`);
      }
      
      const versionId = accessTest.versionId;
      const storyteller = storytellers.find(s => s.id === storytellerId);
      if (!storyteller) {
        throw new Error(`Storyteller not found with ID: ${storytellerId}`);
      }

      const s3Path = storyteller.s3imageKey.replace('s3://skills4life-videos/', '');
      const imageUrl = `https://skills4life-videos.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Path}`;
      const audioUrl = `https://skills4life-videos.s3.${process.env.AWS_REGION}.amazonaws.com/${audioKey}`;

      // Verify URLs
      const [imageAccessible, audioAccessible] = await Promise.all([
        this.verifyUrlAccess(imageUrl),
        this.verifyUrlAccess(audioUrl)
      ]);

      if (!imageAccessible || !audioAccessible) {
        throw new Error('Story teller images or audio resource URLs not accessible');
      }

      console.log('URLs verified accessible:', { imageUrl, audioUrl });
      
      // Always use max value since our estimation is unreliable
      const maxAudioSeconds = 60; // Set to maximum allowed
      console.log(`Using max_audio_seconds: ${maxAudioSeconds}`);

      // Log the full request body for debugging
      const requestBody = {
        version: versionId,
        input: {
          image: imageUrl,
          audio: audioUrl,
          face_enhancement: true,     // Reverted back to true
          use_emotion: true,         // Reverted back to true
          max_audio_seconds: 60,      
          fps: 15,                    // Keeping this reduced for faster processing
          resolution: 512,            // Reverted back to 512
          inference_steps: 20,        // Reverted back to default 20
          num_generated_frames_per_clip: 16,  // Reverted back to default 16
          cfg_scale: 3.5              // Reverted back to default 3.5
        }
      };

      // Call MEMO API with enforced max_audio_seconds
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody)
      });

      // Add better error handling and logging
      if (!response.ok) {
        const errorData = await response.json();
        console.error("MEMO API error:", errorData);
        throw new Error(`MEMO API error: ${response.statusText}`);
      }

      const prediction = await response.json();
      console.log("MEMO prediction created:", prediction);

      // Wait for the result
      const result = await this.waitForLipSyncResult(prediction.id);
      console.log("MEMO generation completed:", result);

      // Download the video file
      const videoResponse = await fetch(result);
      if (!videoResponse.ok) {
        throw new Error(`Failed to download video from ${result}`);
      }
      
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

      // Store the result
      const lipsyncKey = `${basePath}/lipsync.mp4`;
      await this.uploadToS3(lipsyncKey, videoBuffer, 'video/mp4');

      return lipsyncKey;
    } catch (error) {
      console.error('Lip sync generation error:', error);
      throw error;
    }
  }

  // Separate wait function for lip sync with longer timeout
  private async waitForLipSyncResult(predictionId: string): Promise<string> {
    const maxAttempts = 180; // 30 minutes (180 * 10 seconds)
    const delayMs = 10000; // 10 seconds between checks
    
    console.log(`Waiting for lip sync generation (up to 30 minutes)...`);
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await fetch(
          `https://api.replicate.com/v1/predictions/${predictionId}`,
          {
            headers: {
              "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to check prediction status: ${response.statusText}`);
        }

        const prediction = await response.json();
        console.log(`Lip sync status (${attempt+1}/${maxAttempts}): ${prediction.status}`);
        
        if (prediction.status === "succeeded") {
          // The output can be a string URL or an array with URL as first element
          if (Array.isArray(prediction.output)) {
            return prediction.output[0];
          }
          return prediction.output;
        } else if (prediction.status === "failed") {
          throw new Error(`Lip sync generation failed: ${prediction.error}`);
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } catch (error) {
        console.error(`Error checking lip sync status:`, error);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }

    throw new Error("Lip sync generation timed out after 30 minutes");
  }

  private async verifyUrlAccess(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('URL access verification failed:', error);
      return false;
    }
  }

  private async makeS3FilePublic(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      });
      
      return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
    } catch (error) {
      console.error('Error generating file URL:', error);
      throw new Error(`Failed to generate file URL: ${error.message}`);
    }
  }

  async continueVideoGeneration(requestId: string) {
    try {
      const request = await db.videoRequest.findUnique({
        where: { id: requestId },
        include: {
          questionnaire: true,
        },
      });

      if (!request) {
        throw new Error("Video request not found");
      }

      if (!request.script) {
        throw new Error("No script found for video request");
      }

      // Create S3 base path for this request if not exists
      const s3BasePath = request.s3BasePath || `video-requests/${requestId}`;
      
      // Update status to processing
      await this.updateRequestStatus(requestId, "processing");

      // 2. Generate audio from script
      await this.updateRequestStatus(requestId, "script_approved");
      console.log('Starting audio generation...');
      const audioBuffer = await this.generateAudio(request.script, request.storytellerId);
      const audioKey = `${s3BasePath}/audio.mp3`;
      await this.uploadToS3(audioKey, audioBuffer, 'audio/mpeg');
      await this.updateRequestStatus(requestId, "audio_generated");
      console.log('Audio generation completed');

      // 3. Generate captions
      console.log('Starting caption generation...');
      const audioUrl = await this.makeS3FilePublic(audioKey);
      const captions = await this.generateCaptions(audioUrl);
      
      // Store captions and SRT file
      const srtKey = `${s3BasePath}/captions.srt`;
      await this.uploadToS3(srtKey, captions.srt);
      
      await db.videoRequest.update({
        where: { id: requestId },
        data: {
          captions: captions.text,
          srtPath: srtKey,
          status: "captions_generated",
          s3BasePath
        }
      });
      console.log('Caption generation completed');

      // 4. Generate frame images
      console.log('Starting frame generation...');
      const frameKeys = await this.generateFrameImages(request.script, s3BasePath);
      console.log('Frame generation completed');

      // 5. Generate lip sync video
      console.log('Starting lip sync generation...');
      const lipsyncKey = await this.generateLipSync(audioKey, request.storytellerId, s3BasePath);
      
      // Run test video composition to generate a test preview video
      console.log('Starting test video composition...');
      try {
        // Use child_process.spawn to run the test-video-composition.ts script
        const testProcess = spawn('npx', ['tsx', 'scripts/test-video-composition.ts', requestId], {
          stdio: 'inherit', // Show output in server logs
          detached: false
        });
        
        await new Promise((resolve, reject) => {
          testProcess.on('close', (code: number) => {
            if (code === 0) {
              console.log('Test video composition completed successfully');
              resolve(null);
            } else {
              console.warn(`Test video composition exited with code ${code}`);
              // We still resolve because we don't want to fail the whole process if just the test video fails
              resolve(null);
            }
          });
          
          testProcess.on('error', (err: Error) => {
            console.error('Failed to start test video composition:', err);
            // We still resolve because we don't want to fail the whole process if just the test video fails
            resolve(null);
          });
        });
      } catch (testError) {
        // Log but don't throw - we don't want to fail the whole process if just the test video fails
        console.error('Error running test video composition:', testError);
      }
      
      // Update final status
      await db.videoRequest.update({
        where: { id: requestId },
        data: { status: "completed" }
      });
      
      console.log('Video generation process completed successfully');
      
    } catch (error) {
      console.error("Video generation error:", error);
      await this.updateRequestStatus(requestId, "failed");
      throw error;
    }
  }
} 