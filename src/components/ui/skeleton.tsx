import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-900/20", className)} // change from bg-primary/10
      {...props}
    />
  );
}

export { Skeleton };
