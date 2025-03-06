import { PlansRow, SubscriptionPlan } from "types";
import { env } from "@/env.mjs";

export const pricingData: SubscriptionPlan[] = [
  {
    title: "Starter",
    description: "For Beginners",
    benefits: [
      "Questionnaire",
      "Avatar Selection",
      "Story Generator",
    ],
    limitations: [
      "Video Generator",
      "Accessibility Features (i.e. Story Narration)",
    ],
    prices: {
      monthly: 0,
      yearly: 0,
    },
    stripeIds: {
      monthly: null,
      yearly: null,
    },
  },
  {
    title: "Pro",
    description: "Unlock Advanced Features",
    benefits: [
      "Questionnaire",
      "Avatar Selection",
      "Story Generator",
      "Video Generator",
      "Accessibility Features (i.e. Story Narration)",
    ],
    limitations: [

    ],
    prices: {
      monthly: 12,
      yearly: 144,
    },
    stripeIds: {
      monthly: env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PLAN_ID,
      yearly: env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PLAN_ID,
    },
  }
];
