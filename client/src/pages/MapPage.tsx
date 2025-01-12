import DynamicMap from "../map/DynamicMap";
import KakaoMapScriptLoader from "../map/KakaoMapScriptLoader";

export default function MapPage() {
  return (
    <KakaoMapScriptLoader>
      <DynamicMap />
    </KakaoMapScriptLoader>
  );
}
