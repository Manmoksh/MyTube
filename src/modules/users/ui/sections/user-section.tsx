"use client";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  UserPageBanner,
  UserPageBannerSkeleton,
} from "../components/user-page-banner";
import {
  UserPageInfo,
  UserPageInfoSkeleton,
} from "../components/user-page-info";
import { Separator } from "@/components/ui/separator";

interface PageProps {
  userId: string;
}

export const UserSection = ({ userId }: PageProps) => {
  return (
    <Suspense fallback={<UserSectionSkeleton />}>
      <ErrorBoundary fallback={<p>error...</p>}>
        <UserSectionSuspense userId={userId} />
      </ErrorBoundary>
    </Suspense>
  );
};
const UserSectionSkeleton = () => {
  return (
    <div className="flex flex-col ">
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
      <Separator className="bg-zinc-300" />
    </div>
  );
};
export const UserSectionSuspense = ({ userId }: PageProps) => {
  const [user] = trpc.users.getOne.useSuspenseQuery({ id: userId });
  return (
    <div className="flex flex-col ">
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
      <Separator className="bg-zinc-300" />
    </div>
  );
};
