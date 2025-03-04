import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { PlaceType } from "./mapTypes";
import { useMap } from "../hooks/useMap";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { useMapMarker } from "../context/MapMarkerProvider";

const MARKER_IMAGE_URL =
  "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";

export default function MapMarker({
  place,
  index,
  showInfo,
  onSelect,
}: {
  place: PlaceType;
  index: number;
  showInfo?: boolean;
  onSelect: (placeId: string) => void;
}) {
  const map = useMap();
  const { selectedMarker, setSelectedMarker } = useMapMarker();
  const container = useRef(document.createElement("div"));

  const infoWindow = useMemo(() => {
    container.current.style.position = "absolute";
    container.current.style.bottom = "40px";

    return new kakao.maps.CustomOverlay({
      position: place.position,
      content: container.current,
      map: map,
    });
  }, [map, place.position]);

  const marker = useMemo(() => {
    const imageSize = new kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, index * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    };
    const markerImage = new kakao.maps.MarkerImage(
      MARKER_IMAGE_URL,
      imageSize,
      imgOptions
    );
    const marker = new kakao.maps.Marker({
      map,
      position: place.position,
      image: markerImage,
    });

    kakao.maps.event.addListener(marker, "click", function () {
      map.setLevel(4, { animate: true });
      map.setCenter(place.position);
      infoWindow.setMap(map);
      setSelectedMarker(place);
      onSelect(place.id);
    });

    return marker;
  }, [map, place, setSelectedMarker, index, infoWindow]);

  useEffect(() => {
    if (selectedMarker && selectedMarker.position !== place.position) {
      infoWindow.setMap(null);
    }
  }, [selectedMarker, place.position, infoWindow]);

  useLayoutEffect(() => {
    marker.setMap(map);

    return () => {
      marker.setMap(null);
    };
  }, [map, marker]);

  useEffect(() => {
    if (showInfo) {
      infoWindow.setMap(map);
      return;
    }

    return () => {
      infoWindow.setMap(null);
    };
  }, [showInfo, infoWindow, map]);

  return container.current
    ? ReactDOM.createPortal(
        <InfoCard>
          <Title>{place.title}</Title>
          <Divider />
          <Address>📍 {place.address}</Address>
        </InfoCard>,
        container.current
      )
    : null;
}

const InfoCard = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 220px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.12);
  text-align: center;
  font-family: "Arial", sans-serif;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const Address = styled.p`
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background: #ddd;
  border: none;
  margin: 4px 0;
`;
