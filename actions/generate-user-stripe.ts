"use server";

import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { getUserSubscriptionPlan } from "@/lib/subscription";
import { absoluteUrl } from "@/lib/utils";
import { redirect } from "next/navigation";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
}

// const billingUrl = absoluteUrl("/dashboard/billing")
const billingUrl = absoluteUrl("/pricing")

export async function generateUserStripe(priceId: string): Promise<responseAction> {
  let redirectUrl: string = "";

  try {
    const session = await auth()
    const user = session?.user;

    if (!user || !user.email || !user.id) {
      throw new Error("User not authenticated");
    }

    const subscriptionPlan = await getUserSubscriptionPlan(user.id)

    if (subscriptionPlan.isPaid && subscriptionPlan.stripeCustomerId) {
      // User on Paid Plan - Create a portal session
      try {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: subscriptionPlan.stripeCustomerId,
          return_url: billingUrl,
        })

        if (!stripeSession?.url) {
          throw new Error("Failed to create portal session URL");
        }

        redirectUrl = stripeSession.url;
      } catch (stripeError) {
        console.error("Stripe portal creation error:", stripeError);
        throw new Error("Failed to create portal session");
      }
    } else {
      // User on Free Plan - Create a checkout session
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: billingUrl,
          cancel_url: billingUrl,
          payment_method_types: ["card"],
          mode: "subscription",
          billing_address_collection: "auto",
          customer_email: user.email,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          metadata: {
            userId: user.id,
          },
        })

        if (!stripeSession?.url) {
          throw new Error("Failed to create checkout session URL");
        }

        redirectUrl = stripeSession.url;
      } catch (stripeError) {
        console.error("Stripe checkout creation error:", stripeError);
        throw new Error("Failed to create checkout session");
      }
    }
  } catch (error: any) {
    console.error("Stripe session error:", error);
    throw new Error(error.message || "Failed to create Stripe session");
  }

  redirect(redirectUrl);
}