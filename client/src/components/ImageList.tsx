import { useContext } from "react";
import { ImageContext } from "../context/ImageProvider";

export default function ImageList() {
  const { images } = useContext(ImageContext);

  const imgList = images.map((image) => (
    <img
      key={image.key}
      src={`http://localhost:8080/uploads/${image.key}`}
      alt="업로드 이미지"
      style={{ width: "100%" }}
    />
  ));

  return (
    <div>
      <h3>Image List</h3>
      {imgList.length > 0 ? imgList : "사진을 추가하여 갤러리를 완성해보세요!"}
    </div>
  );
}
