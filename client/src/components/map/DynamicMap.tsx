import { ReactNode, useEffect, useRef, useState } from "react";
import { kakaoMapContext } from "../../hooks/useMap";
import styled from "styled-components";
import { extractLatLng } from "../../utils/extractLatLng";
import { getAndMarkUserLocation } from "../../utils/getAndMarkUserLocation";

export default function DynamicMap({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const kakaoMapRef = useRef<HTMLDivElement | null>(null);
  const mapPosition = useRef(
    JSON.parse(
      sessionStorage.getItem("mapPosition") ||
        '{"lat": 37.5665, "lng": 126.9780, "level": 3}'
    )
  );

  useEffect(() => {
    const initializeMap = async () => {
      if (!kakaoMapRef.current) return;

      const { lat, lng } = extractLatLng(mapPosition.current);
      const level = mapPosition.current.level ?? 3;
      const targetPoint = new kakao.maps.LatLng(lat, lng);
      const options = { center: targetPoint, level };

      const newMap = new kakao.maps.Map(kakaoMapRef.current, options);
      setMap(newMap);
      newMap.setCenter(targetPoint);

      kakao.maps.event.addListener(newMap, "center_changed", () => {
        const center = newMap.getCenter();
        const newPosition = {
          lat: center.getLat(),
          lng: center.getLng(),
          level: newMap.getLevel(),
        };

        sessionStorage.setItem("mapPosition", JSON.stringify(newPosition));
        mapPosition.current = newPosition;
      });
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (!map) return;

    getAndMarkUserLocation(map).catch((error) =>
      console.error("Failed to mark user location:", error)
    );
  }, [map]);

  return (
    <>
      <Container>
        <Map ref={kakaoMapRef} />
      </Container>
      {map ? (
        <kakaoMapContext.Provider value={map}>
          {children}
        </kakaoMapContext.Provider>
      ) : (
        <div>지도를 정보를 가져오는데 실패하였습니다.</div>
      )}
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const Map = styled.div`
  width: 100%;
  height: 100%;
`;
