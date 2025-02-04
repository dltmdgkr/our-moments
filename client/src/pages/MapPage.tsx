import { useState } from "react";
import DynamicMap from "../map/DynamicMap";
import SearchLocation from "../map/SearchLocation";
import { PlaceType } from "../map/mapTypes";
import MapMarkerController from "../map/MapMarkerController";
import { HiOutlinePlusSm } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function MapPage() {
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [toggle, setToggle] = useState(false);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <DynamicMap>
        <Link to="/upload">
          <HiOutlinePlusSm
            style={{
              position: "absolute",
              bottom: "80px",
              right: "20px",
              fontSize: "24px",
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "50%",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              zIndex: 2,
            }}
          />
        </Link>
        <IoSearch
          onClick={() => setToggle((prev) => !prev)}
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            fontSize: "24px",
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "50%",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
            zIndex: 2,
          }}
        />
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
        </div>
      </DynamicMap>
    </div>
  );
}
