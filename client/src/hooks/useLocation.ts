import { useEffect, useState } from "react";
import { Place } from "../types/Place";
import { extractLatLng } from "../utils/extractLatLng";

export default function useLocation(selectedMarker: Place | null) {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );

  useEffect(() => {
    if (selectedMarker) {
      const { lat, lng } = extractLatLng(selectedMarker.position);
      setPosition({ lat, lng });
    } else {
      setPosition(null);
    }
  }, [selectedMarker]);

  return position;
}
