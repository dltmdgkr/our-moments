import UploadForm from "./UploadForm";
import { PlaceType } from "../map/mapTypes";
import useLocation from "../hooks/useLocation";
import usePresignedUpload from "../hooks/usePresignedUpload";
import useImagePreview from "../hooks/useImagePreview";

export interface Preview {
  imgSrc: string | ArrayBuffer | null;
  fileName: string;
}

interface MarkerContextType {
  selectedMarker: PlaceType | null;
  setSelectedMarker: (place: PlaceType | null) => void;
}

export default function UploadContainer({
  selectedMarker,
  setSelectedMarker,
}: MarkerContextType) {
  const position = useLocation(selectedMarker);
  const { files, previews, setPreviews, imageSelectHandler } =
    useImagePreview();
  const {
    title,
    description,
    percent,
    isPublic,
    inputRef,
    onSubmit,
    setTitle,
    setDescription,
    setIsPublic,
  } = usePresignedUpload({
    files,
    position,
    selectedMarker,
    setSelectedMarker,
    setPreviews,
  });

  return (
    <UploadForm
      title={title}
      description={description}
      previews={previews}
      percent={percent}
      isPublic={isPublic}
      inputRef={inputRef}
      onSubmit={onSubmit}
      setTitle={setTitle}
      setDescription={setDescription}
      setIsPublic={setIsPublic}
      imageSelectHandler={imageSelectHandler}
    />
  );
}
