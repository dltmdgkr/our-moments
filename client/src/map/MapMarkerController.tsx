import { useEffect } from "react";
import { useMap } from "../hooks/useMap";
import MapMarker from "./MapMarker";
import { PlaceType } from "./mapTypes";

export default function MapMarkerController({
  places,
  selectedPlaceId,
  onSelect,
}: {
  places: PlaceType[];
  selectedPlaceId?: string;
  onSelect: (placeId: string) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (places.length < 1) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      bounds.extend(place.position);
    });

    map.setBounds(bounds);
  }, [places, map]);

  return (
    <>
      {places.map((place, index) => {
        return (
          <MapMarker
            key={place.id}
            place={place}
            index={index}
            showInfo={selectedPlaceId === place.id}
            onSelect={onSelect}
          />
        );
      })}
    </>
  );
}
