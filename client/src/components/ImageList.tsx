import { useContext } from "react";
import { ImageContext } from "../context/ImageProvider";

export default function ImageList() {
  const { images, myPrivateImages, isPublic, setIsPublic } =
    useContext(ImageContext);

  const imgList = (isPublic ? images : myPrivateImages).map((image) => (
    <img
      key={image.key}
      src={`http://localhost:8080/uploads/${image.key}`}
      alt="업로드 이미지"
      style={{ width: "100%" }}
    />
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List {isPublic ? "공개" : "개인"} 사진
      </h3>
      <button onClick={() => setIsPublic((prev) => !prev)}>
        {(isPublic ? "개인" : "공개") + "사진 보기"}
      </button>
      <div style={{ marginTop: 10 }}>
        {imgList.length > 0
          ? imgList
          : "사진을 추가하여 갤러리를 완성해보세요!"}
      </div>
    </div>
  );
}
