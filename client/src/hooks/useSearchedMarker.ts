import { useEffect, useRef, useState } from "react";
import { Place } from "../types/Place";

interface useSearchedMarkerProps {
  map: kakao.maps.Map;
}

export default function useSearchedMarker({ map }: useSearchedMarkerProps) {
  const searchedMarkerRef = useRef<kakao.maps.Marker | null>(null);
  const searchedOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const [searchedPlace, setSearchedPlace] = useState<string>("");

  useEffect(() => {
    if (!map) return;

    return () => {
      clearSearchedMarker();
    };
  }, [map]);

  const addSearchedMarker = (place: Place) => {
    clearSearchedMarker();

    const newMarker = new kakao.maps.Marker({
      position: place.position,
      map: map,
    });
    searchedMarkerRef.current = newMarker;

    const content = document.createElement("div");
    content.innerHTML = `
    <div style="padding:12px; background:rgba(255,255,255,0.95); border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.2);">
        <h4 style="margin:0 0 6px; font-size:16px; color:#333;">${place.title}</h4>
        <p style="margin:0; font-size:14px; color:#555;">📍 ${place.address}</p>
      </div>
    `;

    const newOverlay = new kakao.maps.CustomOverlay({
      content: content,
      position: place.position,
      yAnchor: 1.7,
      map: map,
    });
    searchedOverlayRef.current = newOverlay;

    setSearchedPlace(place.address);
  };

  const clearSearchedMarker = () => {
    if (searchedMarkerRef.current) {
      searchedMarkerRef.current.setMap(null);
      searchedMarkerRef.current = null;
    }
    if (searchedOverlayRef.current) {
      searchedOverlayRef.current.setMap(null);
      searchedOverlayRef.current = null;
    }
    setSearchedPlace("");
  };

  return {
    searchedMarkerRef,
    searchedOverlayRef,
    searchedPlace,
    setSearchedPlace,
    addSearchedMarker,
    clearSearchedMarker,
  };
}
