import SearchForm from "../components/map/SearchForm";
import HamburgerButton from "../components/common/HamburgerButton";
import BottomCard from "../components/common/BottomCard";
import styled from "styled-components";
import MapControls from "../components/map/MapControls";
import useMapPageLogic from "../hooks/useMapPageLogic";
import { useState } from "react";

export default function MapPage({ showModal }: { showModal: () => void }) {
  const [toggle, setToggle] = useState(false);
  const {
    setSelectedPlaceId,
    handleUploadClick,
    handleCurrentLocationClick,
    selectedMomentMarker,
    setSelectedMomentMarker,
  } = useMapPageLogic({ setToggle });

  return (
    <div>
      {!toggle && (
        <HamburgerButton showModal={showModal} position={"absolute"} />
      )}
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
