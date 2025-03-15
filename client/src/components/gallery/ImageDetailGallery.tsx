import { Image } from "../../types/Image";

export default function ImageDetailGallery({ images }: { images: Image[] }) {
  return (
    <>
      {images.map((image) => (
        <img
          key={image._id}
          style={{ width: "100%" }}
          src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
          alt={`image-${image._id}`}
        />
      ))}
    </>
  );
}
