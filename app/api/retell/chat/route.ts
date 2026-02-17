import { NextRequest } from "next/server";

// We import dynamically to avoid bundling issues in edge runtimes. This route runs on Node.
export const runtime = "nodejs";

type CreateChatBody = {
  message: string;
  chat_id?: string;
};

export async function POST(req: NextRequest) {
  try {
    const { message, chat_id }: CreateChatBody = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing required field: message" }),
        { status: 400 }
      );
    }

    const retellApiKey = process.env.RETELL_API_KEY;
    const retellAgentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;

    if (!retellApiKey) {
      return new Response(
        JSON.stringify({ error: "RETELL_API_KEY is not configured" }),
        { status: 500 }
      );
    }

    if (!retellAgentId) {
      return new Response(
        JSON.stringify({ error: "RETELL_AGENT_ID is not configured" }),
        { status: 500 }
      );
    }

    // Import retell-sdk only on demand to ensure Node runtime usage
    const { default: Retell } = await import("retell-sdk");

    const retellClient = new Retell({ apiKey: retellApiKey });

    // Ensure we have a chat session
    const chatId = chat_id
      ? chat_id
      : (await retellClient.chat.create({ agent_id: retellAgentId })).chat_id;

    // Request completion from the agent
    const completion = await retellClient.chat.createChatCompletion({
      chat_id: chatId,
      content: message,
    });

    return new Response(
      JSON.stringify({
        chat_id: chatId,
        messages: completion.messages,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const err = error as Error & { status?: number };
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: err.status || 500 }
    );
  }
}
