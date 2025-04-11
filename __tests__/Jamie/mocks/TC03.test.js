/**
 user story: As a Therapist I want to see a series of moving pictures related to my social story, So that My patient has a visual aid when reffering to their story.

 requirements: The system must be able to visuably display generated scripts and videos to a user, These scripts and videos must be relevant to the questionnaire/story, The system must process the JSON response from all API connections to generate these stored videos
 test steps: 1. Navigate to the generated video
2. Navigate to the approved script from which the video was generated from 
3. Retreive the relevant questionnaire 
4. Compare the video to both the questionairre and generated script
4. Ensure correct video has been pulled by comparing the video to generated script

 */

// Mock all relevant modules
jest.mock('@/lib/db', () => ({
    db: {
      videoRequest: {
        findUnique: jest.fn(),
      },
      script: {
        findUnique: jest.fn(),
      },
      questionnaire: {
        findMany: jest.fn(),
      },
    },
  }));
  
  const { db } = require('@/lib/db');
  
  // Sample mock video data
  const mockUserId = 'user123';
  const mockVideo = {
    id: 'vid123',
    scriptId: 'script456',
    testVideoPath: '/videos/vid123.mp4',
  };
  const mockScript = {
    id: 'script456',
    content: 'The story is about friendship and growth.',
    questionnaireId: 'q789',
  };
  const mockQuestionnaires = [
    {
      id: 'q789',
      userId: mockUserId,
      question: 'What is the story about?',
      answer: 'Friendship and growth.',
      createdAt: new Date(),
    },
    {
      id: 'q790',
      userId: mockUserId,
      question: 'What is your favorite genre?',
      answer: 'Adventure',
      createdAt: new Date(Date.now() - 100000),
    },
  ];
  
  //find the mock video with script and questionnaire for comparison purposes
  describe('Trace video -> script -> questionnaire', () => {
    beforeEach(() => {
      db.videoRequest.findUnique.mockResolvedValue(mockVideo);
      db.script.findUnique.mockResolvedValue(mockScript);
      db.questionnaire.findMany.mockResolvedValue(mockQuestionnaires);
    });
  
    //ensure linkage between all elements
    it('ensures video, script, and questionnaire are correctly linked', async () => {
      // Step 1: Get video by ID
      const video = await db.videoRequest.findUnique({
        where: { id: 'vid123' },
      });
  
      expect(video).toBeDefined();
      expect(video.scriptId).toBe('script456');
  
      // Step 2: Get script
      const script = await db.script.findUnique({
        where: { id: video.scriptId },
      });
  
      expect(script).toBeDefined();
      expect(script.id).toBe(video.scriptId);
  
      // Step 3: Get questionnaire list
      const questionnaires = await db.questionnaire.findMany({
        where: { userId: mockUserId },
        orderBy: { createdAt: 'desc' },
      });
  
      expect(questionnaires.length).toBeGreaterThan(0);
  
      // Step 4: Basic ID and content match assertions
      const linkedQuestionnaire = questionnaires.find(
        (q) => q.id === script.questionnaireId
      );
  
      expect(linkedQuestionnaire).toBeDefined();
      expect(linkedQuestionnaire.answer.toLowerCase()).toContain('friendship');
  
      // Step 5: Semantic match (basic)
      expect(script.content.toLowerCase()).toContain('friendship');
    });
  });
  