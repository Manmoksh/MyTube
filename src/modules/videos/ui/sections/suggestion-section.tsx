"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { videos } from "@/db/schema";
import { trpc } from "@/trpc/client";
import { VideoRowCard } from "../components/video-row-card";
interface SuggestionSectionProps {
  videoId: string;
}
export const SuggestionSection = ({ videoId }: SuggestionSectionProps) => {
  const [suggestion] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
    {
      videoId: videoId,
      limit: DEFAULT_LIMIT,
    },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );
  return (
    <div>
      {suggestion.pages.flatMap((page) =>
        page.items.map((video) => (
          <VideoRowCard data={video} key={video.id} size="compact" />
        ))
      )}
    </div>
  );
};
