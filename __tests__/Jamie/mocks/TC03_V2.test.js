//Mock prisma and modules
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
  
  const mockUserId = 'user123';
  
  const mockVideo = {
    id: 'vid123',
    scriptId: 'script456',
    testVideoPath: '/videos/vid123.mp4',
    status: 'completed',
    isVisible: true,
    userId: mockUserId,
  };
  
  const mockScript = {
    id: 'script456',
    content: 'This story is about Jane who overcame bullying at school during her teenage years in Melbourne.',
    questionnaireId: 'q789',
  };
  
  const mockQuestionnaires = [
    {
      id: 'q789',
      userId: mockUserId,
      who: 'Jane',
      what: 'bullying',
      when: 'teenage years',
      where: 'Melbourne',
      createdAt: new Date(),
    },
  ];
  
  describe('Video → Script → Questionnaire (Structured Stress Case)', () => {
    beforeEach(() => {
      jest.clearAllMocks();
  
      db.videoRequest.findUnique.mockResolvedValue(mockVideo);
      db.script.findUnique.mockResolvedValue(mockScript);
      db.questionnaire.findMany.mockResolvedValue(mockQuestionnaires);
    });
  
    it('should ensure video is correctly linked and script matches the questionnaire content', async () => {
      // Step 1: Get the video
      const video = await db.videoRequest.findUnique({
        where: { id: 'vid123' },
      });
  
      expect(video).toBeDefined();
      expect(video.status).toBe('completed');
      expect(video.isVisible).toBe(true);
  
      // Step 2: Get the linked script
      const script = await db.script.findUnique({
        where: { id: video.scriptId },
      });
  
      expect(script).toBeDefined();
      expect(script.id).toBe(video.scriptId);
  
      // Step 3: Get user's questionnaires
      const questionnaires = await db.questionnaire.findMany({
        where: { userId: video.userId },
        orderBy: { createdAt: 'desc' },
      });
  
      expect(questionnaires.length).toBeGreaterThan(0);
  
      // Step 4: Find the questionnaire linked to the script
      const linkedQ = questionnaires.find((q) => q.id === script.questionnaireId);
  
      expect(linkedQ).toBeDefined();
  
      // Step 5: Check semantic overlap (script mentions who, what, when, where)
      const content = script.content.toLowerCase();
  
      expect(content).toContain(linkedQ.who.toLowerCase());
      expect(content).toContain(linkedQ.what.toLowerCase());
      expect(content).toContain(linkedQ.when.toLowerCase());
      expect(content).toContain(linkedQ.where.toLowerCase());
    });
  });
  