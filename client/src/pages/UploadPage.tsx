import UploadForm from "../components/UploadForm";
import { useMapMarker } from "../context/MapMarkerContext";

export default function UploadPage() {
  const { selectedMarker, setSelectedMarker } = useMapMarker();

  return (
    <div>
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
