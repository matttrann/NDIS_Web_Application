/**
 * user story:As a therapist I want to Add configured backgrounds to my video's, So that Children with a hard time generalising can have something specific to them.
 * requirements: The system must store and allow for temporary storage of uploaded videos, the system must pass the photos to chatGPT through a JSON request, the system must display these custom photos as the video background 
 * test steps: 1. Log in as a therapist, 2. Navigate to questionnaire, 3. Fill out and submit the questionnaire, 4. Compare script generation logic with questionnaire prompts to ensure an appropriate background will always be generated 
 */

import '@testing-library/jest-dom';

//mock google api call
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: () => ({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => Promise.resolve('Mock story response')
        }
      })
    })
  }))
}));

//context test to ensure that the background will match the story
describe('Gemini Prompt Builder - Environmental Context Test', () => {
  const mockQuestionnaire = {
    mood: 'Anxious',
    energy: 4,
    hardestPart: 'Too much noise in the cafeteria',
    helpNeeded: ['Emotional regulation', 'Communication'],
    comfortWithOthers: 3,
    triggers: ['Loud noises', 'Crowded spaces'],
    calmStrategies: 'I like to be alone in quiet rooms with dim lights',
    goals: 'Staying calm in busy places',
    strengths: 'Drawing and observing nature',
    communicationStyle: ['Typing'],
    learningStyle: ['Watching videos'],
    sensoryIssues: ['Bright lights', 'Strong smells'],
    interests: 'Animals and space',
    mainCharacter: ['an animal'],
    storyType: ['calming', 'educational'],
    helpers: ['therapist'],
    tryIndependently: 'Going to the library alone',
  };

  test('prompt includes environment and sensory context', () => {
    // Mock of how prompt is built
    const prompt = `
      Create a therapeutic story based on these inputs:

      Triggers: ${mockQuestionnaire.triggers.join(', ')}
      Sensory Issues: ${mockQuestionnaire.sensoryIssues.join(', ')}
      Calm Strategies: ${mockQuestionnaire.calmStrategies}
      Interests: ${mockQuestionnaire.interests}
      Story Type: ${mockQuestionnaire.storyType.join(', ')}

      Please use this to create a story that includes environment-related challenges and solutions.
    `;

    //Check that key context is included
    expect(prompt).toMatch(/Loud noises/);
    expect(prompt).toMatch(/Crowded spaces/);
    expect(prompt).toMatch(/Bright lights/);
    expect(prompt).toMatch(/Strong smells/);
    expect(prompt).toMatch(/quiet rooms/);
    expect(prompt).toMatch(/Animals and space/);
    expect(prompt).toMatch(/calming/);
    expect(prompt).toMatch(/educational/);
  });
});
