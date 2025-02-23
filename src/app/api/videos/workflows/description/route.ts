import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
interface InputType {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:

- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
-It should be min of 3 lines
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

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
  const description = await context.run(
    "fetch-gemini-description",
    async () => {
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
                  text: DESCRIPTION_SYSTEM_PROMPT,
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
      console.log(body.candidates[0].content.parts[0]);
      const text = body.candidates[0].content.parts[0].text.trim();
      if (!text) throw new Error("Bad Request");

      return text || video.description;
    }
  );

  await context.run("update-video", async () => {
    await db
      .update(videos)
      .set({
        description: description,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
