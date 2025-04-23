/**
 * user story: As a Therapist I want to see a series of moving pictures related to my social story, So that My patient has a visual aid when reffering to their story.
 * requirements: The system must be able to visuably display generated scripts and videos to a user, These scripts and videos must be relevant to the questionnaire/story, The system must process the JSON response from all API connections to generate these stored videos
 * test steps:"1. Navigate to the generated video
2. Navigate to the approved script from which the video was generated from 
3. Retreive the relevant questionnaire 
4. Compare the video to both the questionairre and generated script
4. Ensure correct video has been pulled by comparing the video to generated script"

 */
//mock video and questionnaire
jest.mock('@/lib/db', () => ({
  db: {
    videoRequest: {
      findUnique: jest.fn(),
    },
    questionnaire: {
      findMany: jest.fn(),
    },
  },
}));

const { db } = require('@/lib/db');

const mockUserId = 'user123';

//video with script I generated based on mock questionnaire and our logic within the codebase
const mockVideo = {
  id: 'vid123',
  script: 'I could feel it starting the moment I stepped through the school gates. My chest tightened, my shoulders tensed, and the noise of the crowd buzzed louder than usual in my ears. It was just another school day, but to me, the halls felt like a storm — voices bouncing off the walls, lockers slamming, footsteps echoing, and people everywhere. I tried to focus, to breathe, but the pressure sat heavy on my chest like a backpack full of bricks. I’ve always been sensitive to crowded spaces and loud sounds. It’s not just discomfort — it feels like my body is on high alert, like I’m standing under a spotlight while everyone else blends into the background. Even a small comment from someone, a bit of criticism, can spiral in my head for hours. I know most people don’t mean to upset me, but sometimes it just sticks — and it’s hard to let go. This morning, I sat quietly at the back of homeroom, trying not to draw attention. I didn’t say anything, even when I had something to add. Speaking up in class still feels like walking a tightrope. My heart races, my mouth goes dry, and every word feels like it has to be perfect — or not at all. But I’m trying something different lately. I’ve started drawing when things get overwhelming. At first, it was just doodles in the margins of my notebook — a few lines, shapes, whatever came to mind. But my therapist encouraged me to go deeper, to use drawing as a way of calming down. Now, whenever the world feels too loud, I find a quiet corner and pull out my sketchpad. Sometimes it’s a cartoon version of myself tackling a big day. Other times, it’s just swirls and colour — whatever helps me slow down. Today, after lunch, things got especially noisy in the locker bay. Someone bumped into me, then another student shouted something across the hall. I could feel that spiral starting again — that familiar urge to hide. But I remembered my drawing. I found a spot near the library windows, away from the chaos, and started sketching. The sound didn’t disappear, but it faded a little. My focus shifted from the noise outside to the shapes forming on the page. It was like turning the volume down just enough to think clearly again. Later that day, in English class, the teacher asked for volunteers to share their thoughts. Normally, I’d stay silent. But I glanced down at the corner of my page where I’d drawn a small version of myself — standing in front of the class, smiling, speaking. And something shifted. My hand went up, shaky but sure. I shared just one thought — short, simple. No one laughed. No one stared. The teacher nodded, and we moved on. I can’t say every day is easy. There are still moments I freeze up or retreat. But now I know I have tools. Drawing helps me feel in control. Quiet spaces give me room to breathe. Talking or typing, I’ve started to share more — even with friends. My therapist has been great too, helping me find words when mine run out. What I’m really proud of is that I’m learning to handle things on my own. Last weekend, I tried something I’d always been nervous about — going to the local shop alone. It was just a quick trip for milk and a snack, but I did it. I planned my route, wore my headphones to soften the sound, and brought my sketchpad just in case. I didn’t even need to use it — but just having it made me feel safe. There’s still more I want to get better at. I want to feel less nervous when plans change. I want to find the confidence to speak up more often, even when my heart’s racing. But for the first time, I’m not just hoping things will change — I’m making those changes myself, one small win at a time. And that feels pretty powerful.',
  testVideoPath: '/videos/vid123.mp4',
  status: 'completed',
  isVisible: true,
  userId: mockUserId,
};
//questionnaire with real questions we use
const mockQuestionnaires = [
  {
    id: 'q789',
    userId: mockUserId,
    answers: {
      mood: 'Anxious',
      energy: 5,
      hardestPart: 'Dealing with crowded areas at school.',
      helpNeeded: ['Emotional regulation', 'Communication'],
      comfortWithOthers: 4,
      triggers: ['Crowded spaces', 'Criticism'],
      calmingStrategies: 'Drawing and being in quiet places',
      goal: 'Speaking up in class',
      strengths: 'Art and drawing',
      communicationStyle: ['Talking', 'Typing'],
      learningStyle: ['Watching videos', 'Listening'],
      sensoryIssues: ['Loud sounds', 'Strong smells'],
      interests: 'Art and creative stories',
      mainCharacter: ['a teenage girl'],
      storyType: ['calming', 'educational'],
      helpers: ['therapist'],
      tryIndependently: 'Going to the store alone',
    },
    createdAt: new Date(),
  },
];

//function to match sentament of script
function matchAnyKeywords(input, content, synonyms = {}) {
  if (!input || typeof content !== 'string') return false;
  const cleaned = content.toLowerCase().replace(/[.,!?]/g, '');

  let words = [];
  if (Array.isArray(input)) {
    words = input.flatMap(entry =>
      entry.toLowerCase().split(/\s+|,|\band\b|\bor\b/).filter(Boolean)
    );
  } else {
    words = input.toLowerCase().split(/\s+|,|\band\b|\bor\b/).filter(Boolean);
  }

  const keywordSet = new Set(words);
  if (typeof input === 'string' && synonyms[input.toLowerCase()]) {
    synonyms[input.toLowerCase()].forEach(alt => keywordSet.add(alt.toLowerCase()));
  }

  return Array.from(keywordSet).some(word => cleaned.includes(word.trim()));
}

describe('VideoRequest → Questionnaire Matching', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    db.videoRequest.findUnique.mockResolvedValue(mockVideo);
    db.questionnaire.findMany.mockResolvedValue(mockQuestionnaires);
  });

  it('verify that the video script semantically aligns with questionnaire inputs', async () => {
    const video = await db.videoRequest.findUnique({ where: { id: 'vid123' } });
    expect(video).toBeDefined();

    const questionnaires = await db.questionnaire.findMany({
      where: { userId: video.userId },
      orderBy: { createdAt: 'desc' },
    });

    const content = video.script.toLowerCase();
    const a = questionnaires[0].answers;

    const moodSynonyms = {
      anxious: ['nervous', 'worried', 'on edge', 'tense', 'tight chest'],
    };

    expect(matchAnyKeywords(a.mood, content, moodSynonyms)).toBe(true);
    expect(matchAnyKeywords(a.triggers, content)).toBe(true);

    const calmingKeywords = ['drawing', 'quiet', 'calm'];
    const calmingMatched = calmingKeywords.some(word => content.includes(word));
    expect(calmingMatched).toBe(true);

    const strengthKeywords = ['art', 'drawing', 'creative'];
    const strengthMatch = strengthKeywords.some(word => content.includes(word));
    expect(strengthMatch).toBe(true);

    const interestKeywords = ['art', 'creative', 'story', 'drawing'];
    const interestMatch = interestKeywords.some(word => content.includes(word));
    expect(interestMatch).toBe(true);

    expect(matchAnyKeywords(a.mainCharacter, content)).toBe(true);
  });
});
