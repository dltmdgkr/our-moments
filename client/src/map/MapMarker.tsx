import { useLayoutEffect, useMemo } from "react";
import { PlaceType } from "./mapTypes";
import { useMap } from "../hooks/useMap";

export default function MapMarker({ place }: { place: PlaceType }) {
  const map = useMap();

  const marker = useMemo(() => {
    const marker = new kakao.maps.Marker({ position: place.position });

    marker.setMap(map);

    return marker;
  }, []);

  useLayoutEffect(() => {
    marker.setMap(map);

    return () => {
      marker.setMap(null);
    };
  }, [map]);

  return <div></div>;
}
