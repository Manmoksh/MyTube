import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_FALLBACK } from "../../constants";
import { Skeleton } from "@/components/ui/skeleton";
interface VideoThumbnailProps {
  imageUrl?: string | null;
  title: string;
  previewUrl?: string | null;
  duration: number;
}
export const VideoThumbnailSkeleton = () => {
  return (
    <div className="relative w-full  overflow-hidden  rounded-xl aspect-video">
      <Skeleton className="size-full" />
    </div>
  );
};
export const VideoThumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className="relative group">
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          unoptimized={imageUrl?.includes("utfs.io")}
          src={imageUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl || THUMBNAIL_FALLBACK}
          alt={title}
          fill
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
