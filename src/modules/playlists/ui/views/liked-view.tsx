import { LikedVideosSection } from "../sections/liked-videos-section";

export const LikedView = () => {
  return (
    <div className="max-w-screen-md mx-auto mb-10 px-4 flex flex-col pt-2.5 gap-y-6 ">
      <div>
        <h1 className="text-2xl font-bold">Liked Videos</h1>
        <p className="text-xs text-muted-foreground">
          Videos you have liked 👍
        </p>
      </div>
      <LikedVideosSection />
    </div>
  );
};
