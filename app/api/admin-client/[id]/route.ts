import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { status } = await req.json();
    
    const relationship = await db.adminClientRelationship.update({
      where: { 
        id: params.id,
        adminId: user.id
      },
      data: { status }
    });

    return NextResponse.json(relationship);
  } catch (error) {
    console.error("Error updating admin-client relationship:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    // Delete the relationship
    await db.adminClientRelationship.delete({
      where: { 
        id: params.id,
        adminId: user.id // Ensure the admin can only delete their own relationships
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing client:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 