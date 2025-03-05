import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "./useMap";
import { useEffect, useState } from "react";
import { PlaceType } from "../map/mapTypes";
import { useMapMarker } from "../context/MapMarkerProvider";
import useMoments from "./useMoments";
import { useMomentMarker } from "../context/MomentMarkerProvider";
import useMapMomentMarkers from "./useMapMomentMarkers";
import useMapClickToAddMarker from "./useMapClickToAddMarker";
import { extractLatLng } from "../utils/extractLatLng";
import { moveToCurrentLocation } from "../utils/moveToCurrentLocation";

export default function useMapPageLogic() {
  const location = useLocation();
  const navigate = useNavigate();
  const map = useMap();
  const { position } = location.state || {};

  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [toggle, setToggle] = useState(false);
  const { selectedMarker, setSelectedMarker } = useMapMarker();
  const { moments } = useMoments();
  const { selectedMomentMarker, setSelectedMomentMarker } = useMomentMarker();

  useMapMomentMarkers({
    map,
    moments,
    setSelectedMomentMarker,
  });
  const { markerRef, overlayRef, selectedPlaceId, setSelectedPlaceId } =
    useMapClickToAddMarker({ map, setSelectedMarker, setSelectedMomentMarker });

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

  return {
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
  };
}
