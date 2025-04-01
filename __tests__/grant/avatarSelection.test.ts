import { storytellers } from "@/config/storytellers";

//avatar arrays
const humanMale = ["maori people", "little boy", "adolescent boy"]; 
const humanWoman = ["little girl", "adolescent girl"]
const maoriAvatars = ["maori people"]; 
const teenageAvatars = ["adolescent girl", "adolescent boy"]; 
const animalAvatars = ["koala", "bear"];

describe('Avatar Selection', () => {
    it('Avatar selection should contain atleast 2 male options', () => {
      const storytellerIds = storytellers.map(storyteller => storyteller.id);
      var expectedAvatars = humanMale;
      const numberOfAvatars = humanMale.length

      expectedAvatars.forEach((expectedAvatar, expectedIndex) => {
        storytellerIds.forEach((avatar, index) => {
          if (expectedAvatar === avatar) {
            expectedAvatars.splice(expectedIndex, 1);
          }
        });
      });
  
      expect((expectedAvatars.length === 1) && (numberOfAvatars >= 2)).toBe(true);
    });
  });

  describe('Avatar Selection', () => {
    it('Avatar selection should contain atleast 2 female options', () => {
      const storytellerIds = storytellers.map(storyteller => storyteller.id);
      var expectedAvatars = humanWoman;
      const numberOfAvatars = humanWoman.length

      expectedAvatars.forEach((expectedAvatar, expectedIndex) => {
        storytellerIds.forEach((avatar, index) => {
          if (expectedAvatar === avatar) {
            expectedAvatars.splice(expectedIndex, 1);
          }
        });
      });
  
      expect((expectedAvatars.length === 1) && (numberOfAvatars >= 2)).toBe(true);
    });
  });

  describe('Avatar Selection', () => {
    it('Avatar selection should contain atleast 1 Maori options', () => {
      const storytellerIds = storytellers.map(storyteller => storyteller.id);
      var expectedAvatars = maoriAvatars;
      const numberOfAvatars = maoriAvatars.length

      expectedAvatars.forEach((expectedAvatar, expectedIndex) => {
        storytellerIds.forEach((avatar, index) => {
          if (expectedAvatar === avatar) {
            expectedAvatars.splice(expectedIndex, 1);
          }
        });
      });
  
      expect((expectedAvatars.length <= 1) && (numberOfAvatars >= 1)).toBe(true);
    });
  });

  describe('Avatar Selection', () => {
    it('Avatar selection should contain atleast 1 teenager options', () => {
      const storytellerIds = storytellers.map(storyteller => storyteller.id);
      var expectedAvatars = teenageAvatars;
      const numberOfAvatars = teenageAvatars.length

      expectedAvatars.forEach((expectedAvatar, expectedIndex) => {
        storytellerIds.forEach((avatar, index) => {
          if (expectedAvatar === avatar) {
            expectedAvatars.splice(expectedIndex, 1);
          }
        });
      });
  
      expect((expectedAvatars.length === 1) && (numberOfAvatars !== 0)).toBe(true);
    });
  });

  describe('Avatar Selection', () => {
    it('Avatar selection should contain atleast 1 non-human options', () => {
      const storytellerIds = storytellers.map(storyteller => storyteller.id);
      var expectedAvatars = animalAvatars;
      const numberOfAvatars = animalAvatars.length

      expectedAvatars.forEach((expectedAvatar, expectedIndex) => {
        storytellerIds.forEach((avatar, index) => {
          if (expectedAvatar === avatar) {
            expectedAvatars.splice(expectedIndex, 1);
          }
        });
      });
  
      expect((expectedAvatars.length === 1) && (numberOfAvatars !== 0)).toBe(true);
    });
  });



//avatar images 
const avatarImages = [["maori people", "s3://skills4life-videos/storytellers/maoripeople.png"], 
  ["little girl", "s3://skills4life-videos/storytellers/littlegirl.png"],
  ["adolescent girl", "s3://skills4life-videos/storytellers/teengirl.png"],
  ["little boy", "s3://skills4life-videos/storytellers/littleboy.png"],
  ["adolescent boy", "s3://skills4life-videos/storytellers/teenboy.png"]
  ];

describe('Avatar Selection', () => {
  it('Avatar portrait should match expected image', () => {
    var expectedImages = avatarImages;

    storytellers.forEach((avatar, index) => {
      expectedImages.forEach((expectedImage, expectedIndex) => {
        if (expectedImage[1] === avatar.s3imageKey) {
          expectedImages.splice(expectedIndex, 1);
        }
      });
    });

    expect(expectedImages.length === 0).toBe(true);
  });
});


  