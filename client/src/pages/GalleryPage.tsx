import HamburgerButton from "../components/HamburgerButton";
import ImageList from "../components/ImageList";

export default function GalleryPage({ showModal }: { showModal: () => void }) {
  return (
    <>
      <HamburgerButton showModal={showModal} position={"sticky"} />
      <ImageList />
    </>
  );
}
