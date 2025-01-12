import { useEffect, useRef } from "react";
import "./DynamicMap.css";

export default function DynamicMap() {
  const kakaoMapRef = useRef(null);

  useEffect(() => {
    if (!kakaoMapRef.current) return;

    const targetPoint = new kakao.maps.LatLng(33.450701, 126.570667);
    const options = {
      center: targetPoint,
      level: 3,
    };

    new kakao.maps.Map(kakaoMapRef.current, options);
  }, []);

  return (
    <div className="container">
      <div ref={kakaoMapRef} className="map" />
    </div>
  );
}
