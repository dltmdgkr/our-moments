import { useEffect, useRef, useState } from "react";
import SearchLocation from "../map/SearchLocation";
import { PlaceType } from "../map/mapTypes";
import MapMarkerController from "../map/MapMarkerController";
import { HiOutlinePlusSm } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "../hooks/useMap";
import { useMapMarker } from "../context/MapMarkerProvider";
import { moveToCurrentLocation } from "../utils/moveToCurrentLocation";
import { axiosInstance } from "../utils/axiosInstance";
import HamburgerButton from "../components/HamburgerButton";
import { Post } from "../context/PostProvider";
import BottomCard from "../components/BottomCard";
import { useMomentMarker } from "../context/MomentMarkerProvider";
import styled from "styled-components";
import { extractLatLng } from "../utils/extractLatLng";

export default function MapPage({ showModal }: { showModal: () => void }) {
  const location = useLocation();
  const { position } = location.state || {};
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const map = useMap();
  const { selectedMarker, setSelectedMarker } = useMapMarker();
  const { selectedMomentMarker, setSelectedMomentMarker } = useMomentMarker();
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

  const [moments, setMoments] = useState<Post[]>([]);
  const markersRef = useRef<kakao.maps.Marker[]>([]);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const res = await axiosInstance.get("/images");
        setMoments(res.data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchMoments();
  }, []);

  useEffect(() => {
    if (!map || !selectedMomentMarker?.position) return;

    const { lat, lng } = extractLatLng(selectedMomentMarker.position);
    const targetPoint = new kakao.maps.LatLng(lat, lng);

    map.setCenter(targetPoint);
  }, [map, selectedMomentMarker]);

  useEffect(() => {
    if (position && map) {
      const moveLatLon = new kakao.maps.LatLng(position.lat, position.lng);
      map.setCenter(moveLatLon);
      map.setLevel(4, { animate: true });

      window.history.replaceState({}, document.title);
    }
  }, [position, map]);

  useEffect(() => {
    if (!map || moments.length === 0) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    moments.forEach((moment) => {
      if (!moment.position) return;

      const { lat, lng } = extractLatLng(moment.position);
      const markerPosition = new kakao.maps.LatLng(lat, lng);

      const imageSrc = "/moment_marker.gif";
      const imageSize = new kakao.maps.Size(28, 35);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
        image: markerImage,
      });

      markersRef.current.push(marker);

      kakao.maps.event.addListener(marker, "click", () => {
        map.setCenter(markerPosition);
        map.setLevel(4, { animate: true });

        setSelectedMomentMarker({
          _id: moment._id,
          title: moment.title,
          position: moment.position,
          location: moment.location,
          images: moment.images || [],
          description: moment.description,
          likes: moment.likes,
          user: moment.user,
          createdAt: moment.createdAt,
          public: moment.public,
        });
      });
    });
  }, [map, moments, setSelectedMomentMarker]);

  useEffect(() => {
    if (selectedMomentMarker && markerRef.current && overlayRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
      overlayRef.current.setMap(null);
      overlayRef.current = null;
      setSelectedPlaceId("");
    } else if (
      !isNaN(Number(selectedMarker?.id)) &&
      markerRef.current &&
      overlayRef.current
    ) {
      markerRef.current.setMap(null);
      markerRef.current = null;
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }
  }, [selectedMomentMarker, selectedMarker?.id]);

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
              id:
                result[0]?.road_address?.building_name ||
                result[0]?.address?.address_name ||
                `clicked_marker`,
              title: addressInfo,
              position: latlng,
              address: addressInfo,
            });

            setSelectedPlaceId(
              result[0]?.road_address?.building_name ||
                result[0]?.address?.address_name ||
                `clicked_marker`
            );
            setSelectedMomentMarker(null);
          }
        }
      );
    };

    kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [map, setSelectedMarker, setSelectedMomentMarker]);

  const handleUploadClick = () => {
    if (!selectedPlaceId) {
      alert("위치를 먼저 선택해주세요!");
      return;
    }
    navigate("/upload");
  };

  const handleCurrentLocationClick = () => {
    moveToCurrentLocation(map);
    setSelectedMarker(null);
    setSelectedMomentMarker(null);
    setSelectedPlaceId("");

    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
    if (overlayRef.current) {
      overlayRef.current.setMap(null);
      overlayRef.current = null;
    }
  };

  return (
    <div>
      {!toggle && (
        <HamburgerButton showModal={showModal} position={"absolute"} />
      )}
      <FloatingButton bottom="140px">
        <HiOutlinePlusSm onClick={handleUploadClick} />
      </FloatingButton>
      <FloatingButton bottom="80px">
        <IoSearch onClick={() => setToggle((prev) => !prev)} />
      </FloatingButton>
      <FloatingButton bottom="20px">
        <MdMyLocation onClick={handleCurrentLocationClick} />
      </FloatingButton>
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

const FloatingButton = styled.div<{ bottom: string }>`
  position: absolute;
  bottom: ${(props) => props.bottom};
  right: 20px;
  font-size: 24px;
  background-color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

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
