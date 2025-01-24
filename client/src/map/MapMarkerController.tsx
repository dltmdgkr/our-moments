import { useEffect } from "react";
import { useMap } from "../hooks/useMap";
import MapMarker from "./MapMarker";
import { PlaceType } from "./mapTypes";

export default function MapMarkerController({
  places,
}: {
  places: PlaceType[];
}) {
  const map = useMap();

  useEffect(() => {
    if (places.length < 1) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      bounds.extend(place.position);
    });

    map.setBounds(bounds);
  }, [places]);

  return (
    <>
      {places.map((place) => {
        return <MapMarker key={place.id} place={place} />;
      })}
    </>
  );
}
