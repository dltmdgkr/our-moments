import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";

export default function GalleryPage() {
  return (
    <>
      <h2>사진첩</h2>
      <UploadForm />
      <ImageList />
    </>
  );
}
