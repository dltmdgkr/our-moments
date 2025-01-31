import { useState } from "react";
import DynamicMap from "../map/DynamicMap";
import SearchLocation from "../map/SearchLocation";
import { PlaceType } from "../map/mapTypes";
import MapMarkerController from "../map/MapMarkerController";

export default function MapPage() {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <DynamicMap>
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            height: "100%",
            zIndex: 1,
            overflowY: "auto",
          }}
        >
          <MapMarkerController
            places={places}
            selectedPlaceId={selectedPlaceId}
          />
          <SearchLocation
            onUpdatePlaces={(places) => {
              setPlaces(places);
            }}
            onSelect={(placeId) => {
              setSelectedPlaceId(placeId);
            }}
          />
        </div>
      </DynamicMap>
    </div>
  );
}
