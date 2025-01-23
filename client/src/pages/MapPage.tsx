import { useState } from "react";
import DynamicMap from "../map/DynamicMap";
import SearchLocation from "../map/SearchLocation";
import { PlaceType } from "../map/mapTypes";

export default function MapPage() {
  const [places, setPlaces] = useState<PlaceType[]>([]);

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
          <SearchLocation
            onUpdatePlaces={(places) => {
              setPlaces(places);
            }}
          />
        </div>
      </DynamicMap>
    </div>
  );
}
