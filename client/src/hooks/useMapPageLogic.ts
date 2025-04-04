import { useLocation, useNavigate } from "react-router-dom";
import { useMap } from "./useMap";
import { useContext, useEffect } from "react";
import { useMapMarker } from "../context/MapMarkerProvider";
import useFetchMoments from "./useFetchMoments";
import { useMomentMarker } from "../context/MomentMarkerProvider";
import useMomentMarkersWithClick from "./useMomentMarkersWithClick";
import useMapClickToAddMarker from "./useMapClickToAddMarker";
import { extractLatLng } from "../utils/extractLatLng";
import { moveToCurrentLocation } from "../utils/moveToCurrentLocation";
import { AuthContext } from "../context/AuthProvider";
import { toast } from "react-toastify";
import useSearchedMarker from "./useSearchedMarker";

interface useMapPageLogicProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useMapPageLogic({ setToggle }: useMapPageLogicProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const map = useMap();
  const { position } = location.state || {};
  const { me } = useContext(AuthContext);
  const { selectedMarker, setSelectedMarker } = useMapMarker();
  const { moments } = useFetchMoments();
  const { selectedMomentMarker, setSelectedMomentMarker } = useMomentMarker();

  useMomentMarkersWithClick({
    map,
    moments,
    setSelectedMomentMarker,
    setToggle,
  });

  const {
    markerRef,
    overlayRef,
    selectedPlaceId,
    setSelectedPlaceId,
    mapClicked,
    clearMarker,
  } = useMapClickToAddMarker({
    map,
    setSelectedMarker,
    setSelectedMomentMarker,
  });

  const { searchedPlace, addSearchedMarker, clearSearchedMarker } =
    useSearchedMarker({ map });

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
      clearMarker();
      setSelectedPlaceId("");
    } else if (
      !isNaN(Number(selectedMarker?.id)) &&
      markerRef.current &&
      overlayRef.current
    ) {
      clearMarker();
    } else if (mapClicked) {
      clearSearchedMarker();
    }
  }, [
    mapClicked,
    selectedMomentMarker,
    selectedMarker?.id,
    markerRef,
    overlayRef,
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
    setToggle(false);
    clearMarker();
    clearSearchedMarker();
  };

  return {
    selectedPlaceId,
    setSelectedPlaceId,
    handleUploadClick,
    handleCurrentLocationClick,
    selectedMomentMarker,
    setSelectedMomentMarker,
    addSearchedMarker,
    searchedPlace,
  };
}
