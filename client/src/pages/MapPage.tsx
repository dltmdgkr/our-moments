import { useState } from "react";
import SearchForm from "../components/search/SearchForm";
import HamburgerButton from "../components/common/HamburgerButton";
import BottomCard from "../components/common/BottomCard";
import styled from "styled-components";
import MapControls from "../components/map/MapControls";
import useMapPageLogic from "../hooks/useMapPageLogic";
import { ConfirmDialog } from "../components/common/ConfirmDialog";

export default function MapPage() {
  const [toggle, setToggle] = useState(false);
  const {
    setSelectedPlaceId,
    handleUploadClick,
    handleCurrentLocationClick,
    selectedMomentMarker,
    setSelectedMomentMarker,
    isModalOpen,
    setIsModalOpen,
  } = useMapPageLogic({ setToggle });

  return (
    <div>
      <ConfirmDialog
        isOpen={isModalOpen}
        title="위치가 지정되지 않았어요!"
        description="지도를 클릭하거나, 검색창에서 장소를 선택해 위치를 지정해주세요."
        onConfirm={() => setIsModalOpen(false)}
        confirmText="확인"
      />

      {!toggle && <HamburgerButton position={"absolute"} />}
      <MapControls
        onSearchToggle={() => setToggle((prev) => !prev)}
        onUpload={handleUploadClick}
        onLocation={handleCurrentLocationClick}
      />
      <OverlayWrapper toggle={toggle}>
        {toggle && (
          <SearchForm
            onSelect={(placeId) => {
              setSelectedPlaceId(placeId);
            }}
            setToggle={setToggle}
          />
        )}
      </OverlayWrapper>
      <BottomCard
        selectedMomentMarker={selectedMomentMarker}
        setSelectedMomentMarker={setSelectedMomentMarker}
      />
    </div>
  );
}

const OverlayWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "toggle",
})<{ toggle: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  width: ${(props) => (props.toggle ? "25%" : "0")};
  height: 100%;
  z-index: 3;
  display: flex;
  overflow-y: auto;

  box-shadow: ${(props) =>
    props.toggle ? "4px 0 10px rgba(0, 0, 0, 0.2)" : "none"};
  transition: width 0.3s ease, box-shadow 0.3s ease;
`;
