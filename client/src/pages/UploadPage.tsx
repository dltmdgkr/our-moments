import styled from "styled-components";
import BackButton from "../components/common/BackButton";
import UploadContainer from "../components/gallery/UploadContainer";
import { useMapMarker } from "../context/MapMarkerProvider";

export default function UploadPage() {
  const { selectedMarker, setSelectedMarker } = useMapMarker();

  return (
    <PageWrapper>
      <BackButtonWrapper>
        <BackButton />
      </BackButtonWrapper>
      <UploadContainer
        selectedMarker={selectedMarker}
        setSelectedMarker={setSelectedMarker}
      />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  padding: 24px;
`;

const BackButtonWrapper = styled.div`
  margin-bottom: 16px;
`;
