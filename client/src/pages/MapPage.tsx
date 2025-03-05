import SearchLocation from "../map/SearchLocation";
import MapMarkerController from "../map/MapMarkerController";
import HamburgerButton from "../components/HamburgerButton";
import BottomCard from "../components/BottomCard";
import styled from "styled-components";
import MapControls from "../map/MapControls";
import useMapPageLogic from "../hooks/useMapPageLogic";

export default function MapPage({ showModal }: { showModal: () => void }) {
  const {
    places,
    setPlaces,
    toggle,
    setToggle,
    selectedPlaceId,
    setSelectedPlaceId,
    handleUploadClick,
    handleCurrentLocationClick,
    selectedMomentMarker,
    setSelectedMomentMarker,
  } = useMapPageLogic();

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
        <MapMarkerController
          places={places}
          selectedPlaceId={selectedPlaceId}
          onSelect={(placeId) => {
            setSelectedPlaceId(placeId);
          }}
        />
        {toggle && (
          <SearchLocation
            onUpdatePlaces={(places) => {
              setPlaces(places);
            }}
            onSelect={(placeId) => {
              setSelectedPlaceId(placeId);
            }}
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
  overflow-y: auto;
`;
