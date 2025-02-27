import BackButton from "../components/BackButton";
import UploadForm from "../components/UploadForm";
import { useMapMarker } from "../context/MapMarkerProvider";

export default function UploadPage() {
  const { selectedMarker, setSelectedMarker } = useMapMarker();

  return (
    <div>
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
      <UploadForm
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
      />
    </div>
  );
}
