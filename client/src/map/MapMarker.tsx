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
}: {
  place: PlaceType;
  index: number;
  showInfo?: boolean;
}) {
  const map = useMap();
  const { setSelectedMarker } = useMapMarker();
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
    const imageSize = new kakao.maps.Size(36, 37); // 마커 이미지의 크기
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
      spriteOrigin: new kakao.maps.Point(0, index * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
      offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
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
      map.setCenter(place.position);
      map.setLevel(4, {
        animate: true,
      });
      infoWindow.setMap(map);
      setSelectedMarker(place);
    });

    return marker;
  }, [map, place, setSelectedMarker, index, infoWindow]);

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
        <Message
          onClick={() => {
            infoWindow.setMap(null);
          }}
        >
          {place.title}
        </Message>,
        container.current
      )
    : null;
}

const Message = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 180px;
  min-height: 50px;
  margin-left: -90px;
  border-radius: 16px;

  background-color: #ffe4c4;
`;
