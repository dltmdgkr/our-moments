import { ReactNode, useEffect, useState } from "react";

export default function KakaoMapScriptLoader({
  children,
}: {
  children: ReactNode;
}) {
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);

  const KAKAO_MAP_SCRIPT_ID = "kakao-map-script";
  const KAKAO_MAP_APP_KEY = process.env.REACT_APP_KAKAO_MAP_KEY;

  useEffect(() => {
    const mapScript = document.getElementById(KAKAO_MAP_SCRIPT_ID);

    if (mapScript && window.kakao && window.kakao.maps) {
      setMapScriptLoaded(true);
      return;
    }

    if (!mapScript) {
      const script = document.createElement("script");
      script.id = KAKAO_MAP_SCRIPT_ID;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_APP_KEY}&libraries=services&autoload=false`;
      script.onload = () => {
        window.kakao.maps.load(() => {
          setMapScriptLoaded(true);
        });
      };
      script.onerror = () => {
        setMapScriptLoaded(false);
      };
      document.getElementById("root")?.appendChild(script);
    }
  }, []);

  return (
    <>{mapScriptLoaded ? children : <div>지도를 가져오는 중입니다...</div>}</>
  );
}
