import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

// Request an admin
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "USER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { adminId } = await req.json();

    // Check if admin exists and is actually an admin
    const admin = await db.user.findFirst({
      where: { 
        id: adminId,
        role: "ADMIN"
      }
    });

    if (!admin) {
      return new NextResponse("Admin not found", { status: 404 });
    }

    // Create or update the relationship
    const relationship = await db.adminClientRelationship.upsert({
      where: {
        adminId_clientId: {
          adminId: adminId,
          clientId: user.id
        }
      },
      update: {
        status: "PENDING"
      },
      create: {
        adminId: adminId,
        clientId: user.id,
        status: "PENDING"
      }
    });

    return NextResponse.json(relationship);
  } catch (error) {
    console.error("Error creating admin-client relationship:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Get available admins
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const admins = await db.user.findMany({
      where: {
        role: "ADMIN"
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        description: true
      }
    });

    return NextResponse.json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 