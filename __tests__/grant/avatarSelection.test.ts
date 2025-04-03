// Mock the modules
jest.mock('@/config/storytellers', () => require('./mocks/storytellers.mock.js'));

import { storytellers } from "@/config/storytellers";

// Avatar arrays for testing
const humanMale = ["maori people", "little boy", "adolescent boy"]; 
const humanWoman = ["little girl", "adolescent girl"]
const maoriAvatars = ["maori people"]; 
const teenageAvatars = ["adolescent girl", "adolescent boy"]; 
const animalAvatars = ["koala", "bear"];

// Expected descriptions for avatars
const expectedDescriptions = {
  "maori people": "A storyteller from the Maori heritage",
  "little girl": "A young female character",
  "adolescent girl": "A teenage female character",
  "little boy": "A young male character",
  "adolescent boy": "A teenage male character",
  "koala": "A cute koala character",
  "bear": "A friendly bear character"
};

// Expected voices for avatars
const expectedVoices = {
  "maori people": "en-NZ-Standard-A",
  "little girl": "en-US-Standard-C",
  "adolescent girl": "en-US-Standard-E",
  "little boy": "en-US-Standard-D",
  "adolescent boy": "en-US-Standard-A",
  "koala": "en-AU-Standard-B",
  "bear": "en-US-Standard-J"
};

describe('Avatar Generation (TC09) - Avatar Types', () => {
  it('Avatar selection should contain at least 2 male options', () => {
    const storytellerIds = storytellers.map(storyteller => storyteller.id);
    const maleAvatarsInSystem = humanMale.filter(avatar => storytellerIds.includes(avatar));
    
    expect(maleAvatarsInSystem.length).toBeGreaterThanOrEqual(2);
  });

  it('Avatar selection should contain at least 2 female options', () => {
    const storytellerIds = storytellers.map(storyteller => storyteller.id);
    const femaleAvatarsInSystem = humanWoman.filter(avatar => storytellerIds.includes(avatar));
    
    expect(femaleAvatarsInSystem.length).toBeGreaterThanOrEqual(2);
  });

  it('Avatar selection should contain at least 1 Maori option', () => {
    const storytellerIds = storytellers.map(storyteller => storyteller.id);
    const maoriAvatarsInSystem = maoriAvatars.filter(avatar => storytellerIds.includes(avatar));
    
    expect(maoriAvatarsInSystem.length).toBeGreaterThanOrEqual(1);
  });

  it('Avatar selection should contain at least 1 teenager option', () => {
    const storytellerIds = storytellers.map(storyteller => storyteller.id);
    const teenageAvatarsInSystem = teenageAvatars.filter(avatar => storytellerIds.includes(avatar));
    
    expect(teenageAvatarsInSystem.length).toBeGreaterThanOrEqual(1);
  });

  it('Avatar selection should contain at least 1 non-human option', () => {
    const storytellerIds = storytellers.map(storyteller => storyteller.id);
    const animalAvatarsInSystem = animalAvatars.filter(avatar => storytellerIds.includes(avatar));
    
    expect(animalAvatarsInSystem.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Avatar Generation (TC09) - Avatar Images', () => {
  // Avatar image paths
  const avatarImages = [
    ["maori people", "s3://skills4life-videos/storytellers/maoripeople.png"], 
    ["little girl", "s3://skills4life-videos/storytellers/littlegirl.png"],
    ["adolescent girl", "s3://skills4life-videos/storytellers/teengirl.png"],
    ["little boy", "s3://skills4life-videos/storytellers/littleboy.png"],
    ["adolescent boy", "s3://skills4life-videos/storytellers/teenboy.png"],
    ["koala", "s3://skills4life-videos/storytellers/koala.png"],
    ["bear", "s3://skills4life-videos/storytellers/bear.png"]
  ];

  it('Avatar portrait should match expected image', () => {
    // Check each avatar image path against expected
    for (const [avatarId, expectedPath] of avatarImages) {
      const avatar = storytellers.find(s => s.id === avatarId);
      expect(avatar).toBeDefined();
      expect(avatar?.s3imageKey).toBe(expectedPath);
    }
  });
});

describe('Avatar Generation (TC09) - Avatar Descriptions', () => {
  it('Avatar descriptions should match expected descriptions', () => {
    // For each avatar, check that its description matches the expected description
    Object.entries(expectedDescriptions).forEach(([avatarId, expectedDescription]) => {
      const avatar = storytellers.find(s => s.id === avatarId);
      expect(avatar).toBeDefined();
      expect(avatar?.description).toBe(expectedDescription);
    });
  });
});

describe('Avatar Generation (TC14) - Avatar Voices', () => {
  it('Avatar voices should match background/gender', () => {
    // For each avatar, check that its voice matches the expected voice
    Object.entries(expectedVoices).forEach(([avatarId, expectedVoice]) => {
      const avatar = storytellers.find(s => s.id === avatarId);
      expect(avatar).toBeDefined();
      expect(avatar?.voice).toBe(expectedVoice);
    });
  });
});

  