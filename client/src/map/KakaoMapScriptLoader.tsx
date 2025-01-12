import { ReactNode, useEffect, useState } from "react";

export default function KakaoMapScriptLoader({
  children,
}: {
  children: ReactNode;
}) {
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";
  const KAKAO_MAP_APP_KEY = "f1804ab0bd2b6e4c2ebc307d376c2322";

  useEffect(() => {
    const mapScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

    if (mapScript && !window.kakao) return;

    const script = document.createElement("script");
    script.id = KAKAO_MAP_SCRIPT_ID;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraies=services&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapScriptLoaded(true);
      });
    };
    script.onerror = () => {
      setMapScriptLoaded(false);
    };
    document.getElementById("root")?.appendChild(script);
  }, []);

  return (
    <>{mapScriptLoaded ? children : <div>지도를 가져오는 중입니다...</div>}</>
  );
}
