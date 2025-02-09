import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GalleryPage from "./pages/GalleryPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NavBar from "./components/NavBar";
import ImageDetailPage from "./pages/ImageDetailPage";
import KakaoMapScriptLoader from "./map/KakaoMapScriptLoader";
import MapPage from "./pages/MapPage";
import UploadPage from "./pages/UploadPage";
import { MapMarkerProvider } from "./context/MapMarkerContext";
import DynamicMap from "./map/DynamicMap";

function App() {
  return (
    <>
      <MapMarkerProvider>
        <NavBar />
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <KakaoMapScriptLoader>
                <DynamicMap>
                  <MapPage />
                </DynamicMap>
              </KakaoMapScriptLoader>
            }
          />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/images/:imageId" element={<ImageDetailPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </MapMarkerProvider>
    </>
  );
}

export default App;
