const { PrismaClient } = require('@prisma/client');

// Mock data
const mockVideo = {
  id: 'video123',
  title: 'Uploaded Test Video',
  url: 'https://cdn.example.com/videos/video123.mp4',
};

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const videoStore = {};

  return {
    PrismaClient: jest.fn(() => ({
      video: {
        create: jest.fn(({ data }) => {
          videoStore[data.id] = data;
          return Promise.resolve(data);
        }),
        findUnique: jest.fn(({ where }) => {
          return Promise.resolve(videoStore[where.id]);
        }),
      },
    })),
  };
});

describe('Video Upload and Retrieval (Mocked Prisma)', () => {
  let prisma;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  it('should upload a video and retrieve the same video by ID', async () => {
    // Simulate upload (normally would call an actual function)
    const uploadedVideo = await prisma.video.create({
      data: mockVideo,
    });

    expect(uploadedVideo).toBeDefined();
    expect(uploadedVideo.id).toBe(mockVideo.id);
    expect(uploadedVideo.url).toContain('cdn.example.com');

    // Simulate retrieval
    const retrievedVideo = await prisma.video.findUnique({
      where: { id: mockVideo.id },
    });

    expect(retrievedVideo).toEqual(uploadedVideo);
  });
});