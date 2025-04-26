import styled from "styled-components";
import BackButton from "../components/common/BackButton";
import UploadContainer from "../components/gallery/UploadContainer";
import { useMapMarker } from "../context/MapMarkerProvider";
import { useConfirmModal } from "../context/ConfirmModalProvider";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const { openModal } = useConfirmModal();
  const { selectedMarker, setSelectedMarker } = useMapMarker();
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <BackButtonWrapper>
        <BackButton
          onClick={() =>
            openModal({
              title: "작성을 종료하시겠습니까?",
              description: "작성 중이신 내용은 삭제됩니다.",
              onConfirm: () => navigate(-1),
            })
          }
        />
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
