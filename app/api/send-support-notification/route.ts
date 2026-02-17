import { NextRequest, NextResponse } from "next/server";
import { sendSupportTeamNotification } from "@/lib/email-service-server";

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, userEmail, userCompany } = await request.json();

    if (!userId || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send support team notification email
    const success = await sendSupportTeamNotification(
      userId,
      userName,
      userEmail,
      userCompany || ""
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Support team notification sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send support team notification" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending support team notification:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
