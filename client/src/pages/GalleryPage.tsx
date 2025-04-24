import HamburgerButton from "../components/common/HamburgerButton";
import ImageList from "../components/gallery/ImageList";

export default function GalleryPage() {
  return (
    <>
      <HamburgerButton position={"sticky"} />
      <ImageList />
    </>
  );
}
