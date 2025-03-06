"use server";

import { redirect } from "next/navigation";
import { auth } from "@/auth";

import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

export type responseAction = {
  status: "success" | "error";
  stripeUrl?: string;
};

const billingUrl = absoluteUrl("/dashboard/billing");

export async function openCustomerPortal(
  userStripeId: string,
): Promise<responseAction> {
  let redirectUrl: string = "";

  try {
    const session = await auth();

    if (!session?.user || !session?.user.email) {
      throw new Error("User not authenticated");
    }

    if (!userStripeId) {
      throw new Error("No Stripe customer ID provided");
    }

    // Verify the customer exists in Stripe
    try {
      const customer = await stripe.customers.retrieve(userStripeId);
      if (!customer) {
        throw new Error("Customer not found in Stripe");
      }
    } catch (stripeError) {
      console.error("Stripe customer verification failed:", stripeError);
      throw new Error("Invalid Stripe customer");
    }

    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userStripeId,
      return_url: billingUrl,
    });

    if (!stripeSession?.url) {
      throw new Error("Failed to create Stripe portal session");
    }

    redirectUrl = stripeSession.url;
  } catch (error) {
    console.error("Customer portal error:", error);
    throw error; // This will show the actual error message
  }

  redirect(redirectUrl);
}
