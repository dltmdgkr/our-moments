import { useContext } from "react";
import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";
import { AuthContext } from "../context/AuthProvider";

export default function GalleryPage() {
  const { me } = useContext(AuthContext);
  return (
    <>
      <h2>사진첩</h2>
      {me && <UploadForm />}
      <ImageList />
    </>
  );
}
