import { trpc } from "@/trpc/client";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";

interface useSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}
export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: useSubscriptionProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();
  const subscribe = trpc.subscriptions.create.useMutation({
    onSuccess: () => {
      toast.success("Subscribed");
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscriptions.invalidate();
      utils.users.getOne.invalidate({ id: userId });
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You should login first");
        clerk.openSignIn();
      } else toast.error("Something went wrong");
    },
  });
  const unsubscribe = trpc.subscriptions.remove.useMutation({
    onSuccess: () => {
      toast.success("Unsubscribed");
      utils.subscriptions.getMany.invalidate();
      utils.videos.getManySubscriptions.invalidate();
      utils.users.getOne.invalidate({ id: userId });
      if (fromVideoId) {
        utils.videos.getOne.invalidate({ id: fromVideoId });
      }
    },
    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("You should login first");
        clerk.openSignIn();
      } else toast.error("Something went wrong");
    },
  });
  const isPending = subscribe.isPending || unsubscribe.isPending;
  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };
  return { isPending, onClick };
};
