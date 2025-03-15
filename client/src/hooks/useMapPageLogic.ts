import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "./useMap";
import { useContext, useEffect, useState } from "react";
import { Place } from "../types/Place";
import { useMapMarker } from "../context/MapMarkerProvider";
import useFetchMoments from "./useFetchMoments";
import { useMomentMarker } from "../context/MomentMarkerProvider";
import useMomentMarkersWithClick from "./useMomentMarkersWithClick";
import useMapClickToAddMarker from "./useMapClickToAddMarker";
import { extractLatLng } from "../utils/extractLatLng";
import { moveToCurrentLocation } from "../utils/moveToCurrentLocation";
import { AuthContext } from "../context/AuthProvider";
import { toast } from "react-toastify";

export default function useMapPageLogic() {
  const location = useLocation();
  const navigate = useNavigate();
  const map = useMap();
  const { position } = location.state || {};
  const { me } = useContext(AuthContext);

  const [places, setPlaces] = useState<Place[]>([]);
  const [toggle, setToggle] = useState(false);
  const { selectedMarker, setSelectedMarker } = useMapMarker();
  const { moments } = useFetchMoments();
  const { selectedMomentMarker, setSelectedMomentMarker } = useMomentMarker();

  useMomentMarkersWithClick({ map, moments, setSelectedMomentMarker });
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
  }, [
    selectedMomentMarker,
    selectedMarker?.id,
    markerRef,
    overlayRef,
    setSelectedPlaceId,
  ]);

  const handleUploadClick = () => {
    if (!me) {
      toast.error("로그인이 필요합니다.");
      return;
    }
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
