import BackButton from "../components/common/BackButton";
import UploadContainer from "../components/gallery/UploadContainer";
import { useMapMarker } from "../context/MapMarkerProvider";

export default function UploadPage() {
  const { selectedMarker, setSelectedMarker } = useMapMarker();

  return (
    <>
      <BackButton />
      <h1>업로드 페이지</h1>
      {selectedMarker && (
        <div>
          <h2>선택된 마커</h2>
          <p>
            장소: {selectedMarker.title} ({selectedMarker.address})
          </p>
        </div>
      )}
      <UploadContainer
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
      />
    </>
  );
}
