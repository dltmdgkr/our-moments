import { ReactNode, useEffect, useRef, useState } from "react";
import { getAndMarkUserLocation } from "../utils/getAndMarkUserLocation";
import { kakaoMapContext } from "../hooks/useMap";
import styled from "styled-components";

export default function DynamicMap({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const kakaoMapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!kakaoMapRef.current) return;
      try {
        const userPosition = await getAndMarkUserLocation(null);
        const lat = userPosition?.getLat() ?? 33.450701;
        const lng = userPosition?.getLng() ?? 126.570667;

        const targetPoint = new kakao.maps.LatLng(lat, lng);
        const options = {
          center: targetPoint,
          level: 3,
        };

        const newMap = new kakao.maps.Map(kakaoMapRef.current, options);
        setMap(newMap);
        await getAndMarkUserLocation(newMap);
      } catch (error) {
        console.error("위치 정보를 가져오는데 실패했습니다.", error);
      }
    };

    initializeMap();
  }, []);

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
