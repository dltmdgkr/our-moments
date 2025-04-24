import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GalleryPage from "./pages/GalleryPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ImageDetailPage from "./pages/ImageDetailPage";
import KakaoMapScriptLoader from "./components/map/KakaoMapScriptLoader";
import MapPage from "./pages/MapPage";
import UploadPage from "./pages/UploadPage";
import DynamicMap from "./components/map/DynamicMap";
import { MenuModal } from "./components/modal/MenuModal";
import MomentMarkerProvider from "./context/MomentMarkerProvider";
import MapMarkerProvider from "./context/MapMarkerProvider";
import EditPage from "./pages/EditPage";
import { MenuModalProvider } from "./context/MenuModalProvider";

function App() {
  return (
    <>
      <MapMarkerProvider>
        <MomentMarkerProvider>
          <MenuModalProvider>
            <MenuModal />
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
              <Route path="/images/:postId" element={<ImageDetailPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/edit/:postId" element={<EditPage />} />
            </Routes>
          </MenuModalProvider>
        </MomentMarkerProvider>
      </MapMarkerProvider>
    </>
  );
}

export default App;
