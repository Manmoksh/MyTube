import { SubscriptionVideosSection } from "../sections/SubscriptionVideosSection";

export const SubscriptionView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 flex flex-col pt-2.5 gap-y-6 ">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-xs text-muted-foreground">
          Videos from yor favourite creators
        </p>
      </div>
      <SubscriptionVideosSection />
    </div>
  );
};
