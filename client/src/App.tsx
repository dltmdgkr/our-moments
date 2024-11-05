import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GalleryPage from "./pages/GalleryPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import NavBar from "./components/NavBar";
import ImageDetailPage from "./pages/ImageDetailPage";

function App() {
  return (
    <div style={{ width: 600, margin: "auto" }}>
      <NavBar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/images/:imageId" element={<ImageDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
