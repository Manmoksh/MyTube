import { UserAvatar } from "@/components/user-avatar";
import { SubscriptionButton } from "./subscription-button";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionItemProps {
  name: string;
  imageUrl: string;
  subCount: number;
  onUnsubscribe: () => void;
  disabled: boolean;
}
export const SubscriptionItemSkeleton = () => {
  return (
    <div className="flex items-start gap-4">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 ">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-2/4" />
            <Skeleton className="mt-1 w-20 h-3" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};
export const SubscriptionItem = ({
  name,
  imageUrl,
  disabled,
  onUnsubscribe,
  subCount,
}: SubscriptionItemProps) => {
  return (
    <div className="flex items-start gap-4">
      <UserAvatar size="lg" name={name} imageUrl={imageUrl} />
      <div className="flex-1 ">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm ">{name}</h3>
            <p className="text-xs text-muted-foreground">
              {subCount.toLocaleString()} subscribers
            </p>
          </div>
          <SubscriptionButton
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onUnsubscribe();
            }}
            disabled={disabled}
            isSubscribed
          />
        </div>
      </div>
    </div>
  );
};
