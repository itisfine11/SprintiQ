import { NextRequest, NextResponse } from "next/server";
import { sendApprovalEmail } from "@/lib/email-service-server";

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, userEmail } = await request.json();

    if (!userId || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send approval email to user
    const success = await sendApprovalEmail(userId, userName, userEmail);

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Approval email sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send approval email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending approval email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
