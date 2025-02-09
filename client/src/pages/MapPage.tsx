import { useEffect, useRef, useState } from "react";
import SearchLocation from "../map/SearchLocation";
import { PlaceType } from "../map/mapTypes";
import MapMarkerController from "../map/MapMarkerController";
import { HiOutlinePlusSm } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "../hooks/useMap";
import { useMapMarker } from "../context/MapMarkerContext";

export default function MapPage() {
  const location = useLocation();
  const { position } = location.state || {};

  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const map = useMap();
  const { setSelectedMarker } = useMapMarker();
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  useEffect(() => {
    if (position && map) {
      const moveLatLon = new kakao.maps.LatLng(position.lat, position.lng);
      map.setCenter(moveLatLon);
      map.setLevel(4, { animate: true });
    }
  }, [position, map]);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = (mouseEvent: kakao.maps.event.MouseEvent) => {
      const latlng = mouseEvent.latLng;
      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.coord2Address(
        latlng.getLng(),
        latlng.getLat(),
        (result, status) => {
          if (status === kakao.maps.services.Status.OK) {
            const addressInfo =
              result[0]?.road_address?.address_name ||
              result[0]?.address?.address_name ||
              "주소 정보를 가져올 수 없음";

            if (markerRef.current) {
              markerRef.current.setMap(null);
            }

            if (overlayRef.current) {
              overlayRef.current.setMap(null);
            }

            const newMarker = new kakao.maps.Marker({
              position: latlng,
              map: map,
            });
            markerRef.current = newMarker;

            const content = document.createElement("div");
            content.innerHTML = `
            <div style="
              background-color: white;
              padding: 5px 10px;
              border-radius: 5px;
              box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              white-space: nowrap;
            ">
              ${addressInfo}
            </div>
          `;

            const newOverlay = new kakao.maps.CustomOverlay({
              content: content,
              position: latlng,
              yAnchor: 2.7,
              map: map,
            });

            overlayRef.current = newOverlay;

            setSelectedMarker({
              id: `clicked_marker`,
              title: addressInfo,
              position: latlng,
              address: addressInfo,
            });

            setSelectedPlaceId("clicked_marker");
          }
        }
      );
    };

    kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [map]);

  const handleUploadClick = () => {
    if (!selectedPlaceId) {
      alert("위치를 먼저 선택해주세요!");
      return;
    }
    navigate("/upload");
  };

  return (
    <div>
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
