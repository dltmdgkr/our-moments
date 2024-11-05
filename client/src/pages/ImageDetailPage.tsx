import { useContext } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageProvider";

export default function ImageDetailPage() {
  const { imageId } = useParams();
  const { images, myPrivateImages } = useContext(ImageContext);

  const image =
    images.find((image) => image._id === imageId) ||
    myPrivateImages.find((image) => image._id === imageId);

  if (!image) return <div>Loading...</div>;

  return (
    <div>
      <h3>ImageDetailPage {imageId}</h3>
      <img
        style={{ width: "100%" }}
        src={`http://localhost:8080/uploads/${image.key}`}
        alt={`image-${imageId}`}
      />
    </div>
  );
}
