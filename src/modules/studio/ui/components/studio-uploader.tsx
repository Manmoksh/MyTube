import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";

interface StudioUploaderProps {
  endpoint?: string | null;
  onSuccess: () => void;
}
export const StudioUploader = ({
  endpoint,
  onSuccess,
}: StudioUploaderProps) => {
  return (
    <div>
      <MuxUploader
        endpoint={endpoint}
        id="video-uploader"
        className="hidden group/uploader"
      />
      <MuxUploaderDrop muxUploader="video-uploader" className="group/drop">
        <div></div>
      </MuxUploaderDrop>
    </div>
  );
};
