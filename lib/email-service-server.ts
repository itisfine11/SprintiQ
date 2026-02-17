import { Resend } from "resend";
import { createServerSupabaseClient } from "./supabase/server";

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing RESEND_API_KEY. Set it in your environment for email sending."
    );
  }
  return new Resend(apiKey);
}

export interface EmailNotificationData {
  userId: string;
  eventType: "created" | "updated" | "deleted" | "reordered";
  entityType: "workspace" | "space" | "project" | "task" | "subtask" | "status";
  entityName: string;
  description: string;
  workspaceName?: string;
  workspaceId?: string;
}

export async function sendEmailNotification(
  data: EmailNotificationData
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  try {
    // Get user's email and profile info
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", data.userId)
      .single();

    if (error || !profile?.email) {
      console.error("Failed to get user email:", error);
      return false;
    }

    // Get workspace name if workspaceId is provided
    let workspaceName = data.workspaceName || "your workspace";
    if (data.workspaceId && !data.workspaceName) {
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("name")
        .eq("id", data.workspaceId)
        .single();

      if (workspace?.name) {
        workspaceName = workspace.name;
      }
    }

    const actionText =
      data.eventType === "created"
        ? "created"
        : data.eventType === "updated"
        ? "updated"
        : data.eventType === "deleted"
        ? "deleted"
        : "reordered";

    const entityText =
      data.entityType === "subtask" ? "subtask" : data.entityType;
    const subject = `${
      entityText.charAt(0).toUpperCase() + entityText.slice(1)
    } ${actionText} in ${workspaceName}`;

    const emailHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${subject}</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      color: #374151;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      "
    >
      <!-- Logo Section -->
      <div style="text-align: center; margin-bottom: 32px">
        <img
          src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/logo1.png"
          alt="SprintiQ Logo"
          style="height: 60px; width: auto"
        />
      </div>

      <h2
        style="
          color: #111827;
          margin-bottom: 24px;
          font-size: 24px;
          font-weight: 600;
        "
      >
        ${
          entityText.charAt(0).toUpperCase() + entityText.slice(1)
        } ${actionText}
      </h2>

      <div
        style="
          margin: 24px 0;
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 6px;
          border-left: 4px solid #10b981;
        "
      >
        <p style="margin: 0; font-size: 16px; font-weight: 500; color: #111827">
          ${data.entityName}
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280">
          ${data.description}
        </p>
      </div>

      <p style="margin-bottom: 24px; font-size: 16px">
        This ${entityText} has been ${actionText} in <strong>${workspaceName}</strong>.
      </p>

      <div style="margin: 32px 0; text-align: center">
        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
          "
        >
          View in SprintiQ
        </a>
      </div>

      <div
        style="
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        "
      >
        <p style="color: #6b7280; font-size: 14px; margin: 0">
          You're receiving this email because you have email notifications enabled for ${workspaceName}.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0">
          You can manage your notification preferences in your SprintiQ settings.
        </p>
      </div>
    </div>
  </body>
</html>`;

    await getResendClient().emails.send({
      from: "SprintiQ <support@sprintiq.ai>",
      to: profile.email,
      subject: subject,
      html: emailHtml,
    });

    console.log(`Email notification sent successfully to ${profile.email}`);
    return true;
  } catch (error) {
    console.error("Error sending email notification:", error);
    return false;
  }
}

export async function sendTestEmailNotification(
  userId: string
): Promise<boolean> {
  const testData: EmailNotificationData = {
    userId,
    eventType: "created",
    entityType: "task",
    entityName: "Test Task",
    description:
      "This is a test email notification to verify your email settings are working correctly.",
    workspaceName: "Test Workspace",
  };

  return await sendEmailNotification(testData);
}

export async function sendSignupConfirmationEmail(
  userId: string,
  userName: string,
  userEmail: string
): Promise<boolean> {
  const supabase = await createServerSupabaseClient();

  try {
    const subject = "Your SprintiQ Account is Under Review";

    const emailHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${subject}</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      color: #374151;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      "
    >
      <!-- Logo Section -->
      <div style="text-align: center; margin-bottom: 32px">
        <img
          src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/logo1.png"
          alt="SprintiQ Logo"
          style="height: 60px; width: auto"
        />
      </div>

      <h2
        style="
          color: #111827;
          margin-bottom: 24px;
          font-size: 24px;
          font-weight: 600;
        "
      >
        Welcome to SprintiQ!
      </h2>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        Hi ${userName},
      </p>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        Thank you for signing up for SprintiQ! Your account has been successfully created and is currently under review.
      </p>

      <div
        style="
          margin: 24px 0;
          padding: 16px;
          background-color: #f0f9ff;
          border-radius: 6px;
          border-left: 4px solid #0ea5e9;
        "
      >
        <p style="margin: 0; font-size: 16px; font-weight: 500; color: #0c4a6e">
          Your request is being reviewed now. Please wait for approval.
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #0369a1">
          You will receive an email notification once your account has been approved.
        </p>
      </div>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        While you wait, you can learn more about SprintiQ and its features by visiting our website.
      </p>

      <div style="margin: 32px 0; text-align: center">
        <a
          href="https://www.sprintiq.ai"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
          "
        >
          Visit SprintiQ
        </a>
      </div>

      <div
        style="
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        "
      >
        <p style="color: #6b7280; font-size: 14px; margin: 0">
          If you have any questions or need assistance, please don't hesitate to contact our support team.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0">
          <a href="https://www.sprintiq.ai/contact" style="color: #10b981; text-decoration: none;">
            Contact SprintiQ Support Team
          </a>
        </p>
      </div>
    </div>
  </body>
</html>`;

    await getResendClient().emails.send({
      from: "SprintiQ <support@sprintiq.ai>",
      to: userEmail,
      subject: subject,
      html: emailHtml,
    });

    console.log(`Signup confirmation email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending signup confirmation email:", error);
    return false;
  }
}

export async function sendSupportTeamNotification(
  userId: string,
  userName: string,
  userEmail: string,
  userCompany: string
): Promise<boolean> {
  try {
    const subject = `New User Access Request: ${userName}`;

    const emailHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${subject}</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      color: #374151;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      "
    >
      <!-- Logo Section -->
      <div style="text-align: center; margin-bottom: 32px">
        <img
          src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/logo1.png"
          alt="SprintiQ Logo"
          style="height: 60px; width: auto"
        />
      </div>

      <h2
        style="
          color: #111827;
          margin-bottom: 24px;
          font-size: 24px;
          font-weight: 600;
        "
      >
        New User Access Request
      </h2>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        ${userName} has requested access to SprintiQ.
      </p>

      <div
        style="
          margin: 24px 0;
          padding: 16px;
          background-color: #f0f9ff;
          border-radius: 6px;
          border-left: 4px solid #0ea5e9;
        "
      >
        <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #0c4a6e">
          User Information:
        </h3>
        <div style="margin-bottom: 12px">
          <strong style="color: #0c4a6e">Name:</strong> ${userName}
        </div>
        <div style="margin-bottom: 12px">
          <strong style="color: #0c4a6e">Email:</strong> ${userEmail}
        </div>
        <div style="margin-bottom: 12px">
          <strong style="color: #0c4a6e">Company:</strong> ${
            userCompany || "Not specified"
          }
        </div>
        <div style="margin-bottom: 12px">
          <strong style="color: #0c4a6e">User ID:</strong> ${userId}
        </div>
        <div style="margin-bottom: 12px">
          <strong style="color: #0c4a6e">Request Date:</strong> ${new Date().toLocaleDateString()}
        </div>
      </div>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        Please review this request and update the user's access status in the admin panel.
      </p>

      <div style="margin: 32px 0; text-align: center">
        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
          "
        >
          Review in Admin Panel
        </a>
      </div>

      <div
        style="
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        "
      >
        <p style="color: #6b7280; font-size: 14px; margin: 0">
          This is an automated notification from SprintiQ. Please do not reply to this email.
        </p>
      </div>
    </div>
  </body>
</html>`;

    await getResendClient().emails.send({
      from: "SprintiQ <noreply@sprintiq.ai>",
      to: "support@sprintiq.ai",
      subject: subject,
      html: emailHtml,
    });

    console.log(
      `Support team notification sent successfully for user ${userName}`
    );
    return true;
  } catch (error) {
    console.error("Error sending support team notification:", error);
    return false;
  }
}

export async function sendApprovalEmail(
  userId: string,
  userName: string,
  userEmail: string
): Promise<boolean> {
  try {
    const subject = "Your SprintiQ Access Has Been Approved!";

    const emailHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${subject}</title>
  </head>
  <body
    style="
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      color: #374151;
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        padding: 40px 20px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      "
    >
      <!-- Logo Section -->
      <div style="text-align: center; margin-bottom: 32px">
        <img
          src="https://vttwakzntflxuylenszu.supabase.co/storage/v1/object/public/images/SprintiQ/logo1.png"
          alt="SprintiQ Logo"
          style="height: 60px; width: auto"
        />
      </div>

      <h2
        style="
          color: #111827;
          margin-bottom: 24px;
          font-size: 24px;
          font-weight: 600;
        "
      >
        Welcome to SprintiQ!
      </h2>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        Hi ${userName},
      </p>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        Great news! Your SprintiQ account has been approved and you now have full access to the platform.
      </p>

      <div
        style="
          margin: 24px 0;
          padding: 16px;
          background-color: #f0fdf4;
          border-radius: 6px;
          border-left: 4px solid #22c55e;
        "
      >
        <p style="margin: 0; font-size: 16px; font-weight: 500; color: #166534">
          Your access request has been approved!
        </p>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #15803d">
          You can now sign in and start using SprintiQ to manage your agile projects.
        </p>
      </div>

      <p style="margin-bottom: 24px; font-size: 16px; color: #374151">
        Get started by creating your first workspace and exploring the powerful features that SprintiQ offers for agile product development.
      </p>

      <div style="margin: 32px 0; text-align: center">
        <a
          href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #10b981;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            font-size: 16px;
            transition: background-color 0.2s;
          "
        >
          Access SprintiQ
        </a>
      </div>

      <div
        style="
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        "
      >
        <p style="color: #6b7280; font-size: 14px; margin: 0">
          If you have any questions or need assistance getting started, please don't hesitate to contact our support team.
        </p>
        <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0 0">
          <a href="https://www.sprintiq.ai/contact" style="color: #10b981; text-decoration: none;">
            Contact SprintiQ Support Team
          </a>
        </p>
      </div>
    </div>
  </body>
</html>`;

    await getResendClient().emails.send({
      from: "SprintiQ <support@sprintiq.ai>",
      to: userEmail,
      subject: subject,
      html: emailHtml,
    });

    console.log(`Approval email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending approval email:", error);
    return false;
  }
}
