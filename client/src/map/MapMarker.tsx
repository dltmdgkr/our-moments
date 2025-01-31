import { useEffect, useLayoutEffect, useMemo } from "react";
import { PlaceType } from "./mapTypes";
import { useMap } from "../hooks/useMap";

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

    return marker;
  }, []);

  useLayoutEffect(() => {
    marker.setMap(map);

    return () => {
      marker.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (showInfo) {
      console.log(place.title);
    }
  }, [showInfo]);

  return <div></div>;
}
