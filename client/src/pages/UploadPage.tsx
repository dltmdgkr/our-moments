import styled from "styled-components";
import BackButton from "../components/common/BackButton";
import UploadContainer from "../components/gallery/UploadContainer";
import { useMapMarker } from "../context/MapMarkerProvider";
import { useConfirmModal } from "../context/ConfirmModalProvider";

export default function UploadPage() {
  const { openModal } = useConfirmModal();
  const { selectedMarker, setSelectedMarker } = useMapMarker();

  return (
    <PageWrapper>
      <BackButtonWrapper>
        <BackButton onClick={openModal} />
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
