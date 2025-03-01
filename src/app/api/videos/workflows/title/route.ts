import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
interface InputType {
  userId: string;
  videoId: string;
}
const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:

- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Use action-driven language to make the title more clickable.
- Use strong, relevant keywords to improve searchability.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Focus on the most unique or exciting part of the transcript.
- If an emoji naturally enhances engagement, include it .
- Ensure the title is 3-8 words long and no more than 100 characters.
- Do not add quotes or any additional formatting.
`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;
  const { userId, videoId } = input;
  const video = await context.run("get-video", async () => {
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    if (!existingVideo) throw new Error("Not Found");
    return existingVideo;
  });
  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = await response.text();
    if (!text) throw new Error("Bad Request");
    return text;
  });
  const title = await context.run("fetch-gemini-title", async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: transcript,
                },
              ],
            },
          ],
          systemInstruction: {
            role: "system",
            parts: [
              {
                text: TITLE_SYSTEM_PROMPT,
              },
            ],
          },

          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          },
        }),
      }
    );

    const body = await response.json();
    const text = body.candidates[0].content.parts[0].text.trim();
    if (!text) throw new Error("Bad Request");

    return text || video.title;
  });

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        title: title,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
