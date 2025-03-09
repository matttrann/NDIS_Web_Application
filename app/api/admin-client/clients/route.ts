import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clients = await db.adminClientRelationship.findMany({
      where: {
        adminId: user.id,
        status: "APPROVED"
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            questionnaires: true,
            videoRequests: true
          }
        }
      }
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching admin clients:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 