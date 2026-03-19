import OpenAI from "openai";

export const runtime = "edge";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be seprated bt '||' . These questions are for an anonymous social messaging plateform, like Qooh.me, and should be suitable for a diverse audience. Avoid personla aor sensitive topics, focusing instaed on universal themes that encourage frienfly intraction. For example, you output should be structures like this : 'what's a hobby you've recently started?'||If you could have dinner with any historical figure, who would it be?||what's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment";

    const stream = await client.responses.stream({
      model: "gpt-4o-mini", 
      input: prompt,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "response.output_text.delta") {
            controller.enqueue(encoder.encode(event.delta));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Streaming Error:", error);
    return new Response("Error generating response", { status: 500 });
  }
}
