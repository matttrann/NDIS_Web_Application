interface Storyteller {
  id: string;
  name: string;
  avatar: string;
  s3imageKey: string;
  imageUrl?: string;
}

export const storytellers: Storyteller[] = [
  {
    id: "top g",
    name: "top g",
    avatar: "/storytellers/topg.png", // Local path for selecting Storyteller cards
    s3imageKey: "s3://skills4life-videos/storytellers/topg.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/topg.png`
  },
  // {
  //   id: "la flame",
  //   name: "la flame",
  //   avatar: "/storytellers/laflame.png",
  //   s3imageKey: "s3://skills4life-videos/storytellers/laflame.png"
  // },
  {
    id: "ronaldo",
    name: "ronaldo",
    avatar: "/storytellers/ronaldo.png",
    s3imageKey: "s3://skills4life-videos/storytellers/ronaldo.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/ronaldo.png`
  },
  {
    id: "ishowspeed",
    name: "ishowspeed",
    avatar: "/storytellers/ishowspeed.png",
    s3imageKey: "s3://skills4life-videos/storytellers/ishowspeed.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/ishowspeed.png`
  },
  {
    id: "sydney sweeney",
    name: "sydney sweeney",
    avatar: "/storytellers/sydneysweeney.png",
    s3imageKey: "s3://skills4life-videos/storytellers/sydneysweeney.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/sydneysweeney.png`
  },
  {
    id: "kim kardashian",
    name: "kim kardashian",
    avatar: "/storytellers/kimkardashian.png",
    s3imageKey: "s3://skills4life-videos/storytellers/kimkardashian.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/kimkardashian.png`
  },
  {
    id: "lisa",
    name: "lisa",
    avatar: "/storytellers/lisa.png",
    s3imageKey: "s3://skills4life-videos/storytellers/lisa.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/lisa.png`
  },
  // {
  //   id: "ironmouse",
  //   name: "ironmouse",
  //   avatar: "/storytellers/ironmouse.png",
  //   s3imageKey: "s3://skills4life-videos/storytellers/ironmouse.png"
  // },
  {
    id: "koala",
    name: "koala",
    avatar: "/storytellers/koala.png",
    s3imageKey: "s3://skills4life-videos/storytellers/koala.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/koala.png`
  },
  
  // {
  //   id: "kangaroo",
  //   name: "kangaroo",
  //   avatar: "/storytellers/kangaroo.png",
  //   s3imageKey: "s3://skills4life-videos/storytellers/kangaroo.png"
  // },
  {
    id: "bear",
    name: "bear",
    avatar: "/storytellers/bear.png",
    s3imageKey: "s3://skills4life-videos/storytellers/bear.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/bear.png`
  },
  {
    id: "maori people",
    name: "maori people",
    avatar: "/storytellers/maoripeople.png",
    s3imageKey: "s3://skills4life-videos/storytellers/maoripeople.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/maoripeople.png`
  },
  {
    id: "little girl",
    name: "little girl",
    avatar: "/storytellers/littlegirl.png",
    s3imageKey: "s3://skills4life-videos/storytellers/littlegirl.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/littlegirl.png`
  },
  {
    id: "adolescent girl",
    name: "adolescent girl",
    avatar: "/storytellers/teenagegirl.png",
    s3imageKey: "s3://skills4life-videos/storytellers/teengirl.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/teengirl.png`
  },
  {
    id: "little boy",
    name: "little boy",
    avatar: "/storytellers/littleboy.png",
    s3imageKey: "s3://skills4life-videos/storytellers/littleboy.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/littleboy.png`
  },
  {
    id: "adolescent boy",
    name: "adolescent boy",
    avatar: "/storytellers/teenageboy.png",
    s3imageKey: "s3://skills4life-videos/storytellers/teenboy.png",
    imageUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/storytellers/teenboy.png`
  },
]; 