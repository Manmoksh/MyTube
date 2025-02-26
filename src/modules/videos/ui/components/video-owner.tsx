import Link from "next/link";
import { VideoGetOneOutput } from "../../types";
import { UserAvatar } from "@/components/user-avatar";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SubscriptionButton } from "@/modules/subscriptions/ui/components/subscription-button";
import { UserInfo } from "@/modules/users/ui/components/user-info";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: VideoGetOneOutput["id"];
}
export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId } = useAuth();
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex items-center gap-3 min-w-0">
          <UserAvatar imageUrl={user.imageUrl} name={user.name} size="lg" />
          <div className="flex flex-col gap-1 min-w-0">
            <UserInfo name={user.name} size="lg" />
            <span className="text-sm text-muted-foreground line-clamp-1">
              {0} subscribers
            </span>
          </div>
        </div>
      </Link>
      {userId === user.clerkId ? (
        <Button className="rounded-full" asChild variant="secondary">
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={() => {}}
          disabled={false}
          isSubscribed={false}
          className="flex-none"
        />
      )}
    </div>
  );
};
