"use client";

import { DEFAULT_LIMIT } from "@/constants";
import { videos } from "@/db/schema";
import { trpc } from "@/trpc/client";
import {
  VideoRowCard,
  VideoRowCardskeleton,
} from "../components/video-row-card";
import {
  VideoGridCard,
  VideoGridCardskeleton,
} from "../components/video-grid-card";
import { InfiniteScroll } from "@/components/infinite-scroll";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
interface SuggestionSectionProps {
  videoId: string;
  isManual?: boolean;
}
export const SuggestionSection = ({
  videoId,
  isManual,
}: SuggestionSectionProps) => {
  return (
    <Suspense fallback={<SuggestionSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <SuggestionSectionSuspense videoId={videoId} isManual={isManual} />
      </ErrorBoundary>
    </Suspense>
  );
};
const SuggestionSectionSkeleton = () => {
  return (
    <>
      <div className="hidden md:block space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoRowCardskeleton key={index} size="compact" />
        ))}
      </div>
      <div className="block md:hidden space-y-10">
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoGridCardskeleton key={index} />
        ))}
      </div>
    </>
  );
};
const SuggestionSectionSuspense = ({
  videoId,
  isManual,
}: SuggestionSectionProps) => {
  const [suggestion, { hasNextPage, fetchNextPage, isFetchingNextPage }] =
    trpc.suggestions.getMany.useSuspenseInfiniteQuery(
      {
        videoId: videoId,
        limit: DEFAULT_LIMIT,
      },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );
  return (
    <>
      <div className="hidden md:block space-y-3">
        {suggestion.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoRowCard data={video} key={video.id} size="compact" />
          ))
        )}
      </div>
      <div className="block md:hidden scroll-py-10">
        {suggestion.pages.flatMap((page) =>
          page.items.map((video) => (
            <VideoGridCard data={video} key={video.id} />
          ))
        )}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};
