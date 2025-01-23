import { ReactNode, useEffect, useRef, useState } from "react";
import "./DynamicMap.css";
import { kakaoMapContext } from "../hooks/useMap";

export default function DynamicMap({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<kakao.maps.Map>();
  const kakaoMapRef = useRef(null);

  useEffect(() => {
    if (!kakaoMapRef.current) return;

    const targetPoint = new kakao.maps.LatLng(33.450701, 126.570667);
    const options = {
      center: targetPoint,
      level: 3,
    };

    setMap(new kakao.maps.Map(kakaoMapRef.current, options));
  }, []);

  return (
    <>
      <div className="container">
        <div ref={kakaoMapRef} className="map" />
      </div>
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
