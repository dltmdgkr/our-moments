import DynamicMap from "../map/DynamicMap";
import KakaoMapScriptLoader from "../map/KakaoMapScriptLoader";
import SearchLocation from "../map/SearchLocation";

export default function MapPage() {
  return (
    <KakaoMapScriptLoader>
      <div style={{ position: "relative", height: "100vh" }}>
        <DynamicMap />
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            height: "100%",
            zIndex: 1,
          }}
        >
          <SearchLocation />
        </div>
      </div>
    </KakaoMapScriptLoader>
  );
}
