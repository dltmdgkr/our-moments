import { useEffect, useState } from "react";
import SearchLocation from "../map/SearchLocation";
import { PlaceType } from "../map/mapTypes";
import MapMarkerController from "../map/MapMarkerController";
import { HiOutlinePlusSm } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "../hooks/useMap";

export default function MapPage() {
  const location = useLocation();
  const { position } = location.state || {};

  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const map = useMap();

  useEffect(() => {
    if (position && map) {
      const moveLatLon = new kakao.maps.LatLng(position.lat, position.lng);
      map.setCenter(moveLatLon);
      map.setLevel(4, { animate: true });
    }
  }, [position, map]);

  const handleUploadClick = () => {
    if (!selectedPlaceId) {
      alert("위치를 먼저 선택해주세요!");
      return;
    }
    navigate("/upload");
  };

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <HiOutlinePlusSm
        onClick={handleUploadClick}
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
    </div>
  );
}
