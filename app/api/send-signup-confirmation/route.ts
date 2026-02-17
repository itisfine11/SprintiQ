import { NextRequest, NextResponse } from "next/server";
import { sendSignupConfirmationEmail } from "@/lib/email-service-server";

export async function POST(request: NextRequest) {
  try {
    const { userId, userName, userEmail } = await request.json();

    if (!userId || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Send signup confirmation email
    const success = await sendSignupConfirmationEmail(
      userId,
      userName,
      userEmail
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: "Signup confirmation email sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send signup confirmation email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending signup confirmation email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
