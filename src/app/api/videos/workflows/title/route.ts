import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";
interface InputType {
  userId: string;
  videoId: string;
}
const TITLE_SYSTEM_PROMPT = `
Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Follow these guidelines to create a title that maximizes discoverability, hooks viewers, and reflects the content accurately:
 
- Analyze the transcript to pinpoint the main topic and any unique or compelling elements, such as specific tools, techniques, trending ideas, or standout features.
- Include 1-3 high-impact keywords that match likely search terms. Position them early in the title to boost SEO performance.
- Use the pipe symbol (|) to separate key phrases or keywords, improving readability and search weighting (e.g., "Fix Bugs | Python Tricks").
- Emphasize the video’s most attention-grabbing aspect—like a quick solution, a hot trend, or a beginner-friendly angle—to spark viewer interest.
- Incorporate action verbs (e.g., "Master," "Create," "Solve") or value-driven terms (e.g., "Easy," "Pro Tips") to make the title dynamic and appealing.
- Optionally, add 1-2 relevant emojis if they align with the content and resonate with the target audience (e.g., 🎨 for art, ⚙️ for tech). Avoid overuse.
- Keep language simple and avoid niche jargon unless it’s a searchable term for the intended viewers (e.g., "Kubernetes" for tech pros).
- Ensure the title is 3-8 words long and under 100 characters (including spaces, |, and emojis) to fit YouTube’s display limits.
- Confirm the title truthfully represents the video content to build trust and avoid misleading viewers.
- Craft a creative, catchy phrase while adhering to all specified rules.
 
Return ONLY the title as plain text. No quotes, brackets, or extra formatting.
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
