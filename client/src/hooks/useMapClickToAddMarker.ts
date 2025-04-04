import { useEffect, useRef, useState } from "react";
import { Place } from "../types/Place";
import { Post } from "../types/Post";

interface useMapClickToAddMarkerProps {
  map: kakao.maps.Map | null;
  setSelectedMarker: (place: Place | null) => void;
  setSelectedMomentMarker: (post: Post | null) => void;
}

export default function useMapClickToAddMarker({
  map,
  setSelectedMarker,
  setSelectedMomentMarker,
}: useMapClickToAddMarkerProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
  const [mapClicked, setMapClicked] = useState(false);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const overlayRef = useRef<kakao.maps.CustomOverlay | null>(null);

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

            clearMarker();

            const newMarker = new kakao.maps.Marker({
              position: latlng,
              map: map,
            });
            markerRef.current = newMarker;

            const content = document.createElement("div");
            content.innerHTML = `
              <div style="padding: 12px; background: rgba(255, 255, 255, 0.95); border-radius: 10px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);">
                <p style="margin: 0; font-size: 14px; color: #555;">
                  📍 ${addressInfo}
                </p>
              </div>
            `;
            const newOverlay = new kakao.maps.CustomOverlay({
              content: content,
              position: latlng,
              yAnchor: 2,
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
            setMapClicked(true);
          }
        }
      );
    };

    kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handleMapClick);
      clearMarker();
    };
  }, [map, setSelectedMarker, setSelectedMomentMarker]);

  const clearMarker = () => {
    if (markerRef.current && overlayRef.current) {
      markerRef.current.setMap(null);
      overlayRef.current.setMap(null);
      setMapClicked(false);
      markerRef.current = null;
      overlayRef.current = null;
    }
  };

  return {
    markerRef,
    overlayRef,
    selectedPlaceId,
    setSelectedPlaceId,
    mapClicked,
    setMapClicked,
    clearMarker,
  };
}
