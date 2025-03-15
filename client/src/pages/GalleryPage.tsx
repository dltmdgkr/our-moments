import HamburgerButton from "../components/common/HamburgerButton";
import ImageList from "../components/gallery/ImageList";

export default function GalleryPage({ showModal }: { showModal: () => void }) {
  return (
    <>
      <HamburgerButton showModal={showModal} position={"sticky"} />
      <ImageList />
    </>
  );
}
