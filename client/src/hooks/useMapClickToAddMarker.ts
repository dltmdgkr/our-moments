import { useEffect, useRef, useState } from "react";
import { Post } from "../context/PostProvider";
import { PlaceType } from "../map/mapTypes";

interface useMapClickToAddMarkerProps {
  map: kakao.maps.Map;
  setSelectedMarker: (place: PlaceType | null) => void;
  setSelectedMomentMarker: (post: Post | null) => void;
}

export default function useMapClickToAddMarker({
  map,
  setSelectedMarker,
  setSelectedMomentMarker,
}: useMapClickToAddMarkerProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState("");
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

  return { markerRef, overlayRef, selectedPlaceId, setSelectedPlaceId };
}
