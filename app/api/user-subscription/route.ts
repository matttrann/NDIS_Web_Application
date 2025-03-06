import { auth } from "@/auth";
import { getUserSubscriptionPlan } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const subscriptionPlan = await getUserSubscriptionPlan(session.user.id);

    return new Response(JSON.stringify(subscriptionPlan), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}