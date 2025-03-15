import { useEffect, useState } from "react";
import { Place } from "../types/Place";

export default function useLocation(selectedMarker: Place | null) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (selectedMarker) {
      setPosition({
        lat: selectedMarker.position.getLat(),
        lng: selectedMarker.position.getLng(),
      });
    } else {
      setPosition(null);
    }
  }, [selectedMarker]);

  return position;
}
