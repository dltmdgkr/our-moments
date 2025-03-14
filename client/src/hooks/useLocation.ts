import { useEffect, useState } from "react";
import { PlaceType } from "../map/mapTypes";

export default function useLocation(selectedMarker: PlaceType | null) {
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
