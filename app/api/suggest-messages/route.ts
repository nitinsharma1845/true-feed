import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API!,
  });

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-3-flash-preview",
      contents:
        "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seprated bt '||' . These questions are for an anonymous social messaging plateform, like Qooh.me, and should be suitable for a diverse audience. Avoid personla aor sensitive topics, focusing instaed on universal themes that encourage frienfly intraction. For example, you output should be structures like this : 'what's a hobby you've recently started?'||If you could have dinner with any historical figure, who would it be?||what's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment",
    });

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (err) {
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("ERROR:", error);
    return new Response("Error", { status: 500 });
  }
}
