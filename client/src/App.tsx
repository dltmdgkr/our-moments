import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GalleryPage from "./pages/GalleryPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ImageDetailPage from "./pages/ImageDetailPage";
import KakaoMapScriptLoader from "./map/KakaoMapScriptLoader";
import MapPage from "./pages/MapPage";
import UploadPage from "./pages/UploadPage";
import { MapMarkerProvider } from "./context/MapMarkerContext";
import DynamicMap from "./map/DynamicMap";
import { useState } from "react";
import { MenuModal } from "./components/MenuModal";

function App() {
  const [openModal, setOpenModal] = useState(false);

  const showModal = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <>
      <MapMarkerProvider>
        <MenuModal openModal={openModal} setOpenModal={setOpenModal} />
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <KakaoMapScriptLoader>
                <DynamicMap>
                  <MapPage showModal={showModal} />
                </DynamicMap>
              </KakaoMapScriptLoader>
            }
          />
          <Route
            path="/gallery"
            element={<GalleryPage showModal={showModal} />}
          />
          <Route
            path="/signup"
            element={<SignupPage showModal={showModal} />}
          />
          <Route path="/login" element={<LoginPage showModal={showModal} />} />
          <Route path="/images/:postId" element={<ImageDetailPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </MapMarkerProvider>
    </>
  );
}

export default App;
