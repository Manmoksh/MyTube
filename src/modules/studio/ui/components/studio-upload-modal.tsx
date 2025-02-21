"use client";
import { ResponsiveModal } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { StudioUploader } from "./studio-uploader";
import MuxUploader from "@mux/mux-uploader-react";

export const StudioUploadModal = () => {
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created");
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });
  return (
    <>
      <ResponsiveModal
        title="upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader onSuccess={() => {}} endpoint={create.data?.url} />
        ) : (
          <Loader2Icon className="animate-spin" />
        )}
      </ResponsiveModal>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="size-5 animate-spin" />
        ) : (
          <PlusIcon className="size-5" />
        )}
        Create
      </Button>
    </>
  );
};
