import { useContext } from "react";
import { ImageContext } from "../context/ImageProvider";
import "./ImageList.css";
import { Link } from "react-router-dom";

export default function ImageList() {
  const { images, myPrivateImages, isPublic, setIsPublic } =
    useContext(ImageContext);

  const imgList = (isPublic ? images : myPrivateImages).map((image) => (
    <Link key={image.key} to={`/images/${image._id}`}>
      <img
        src={`http://localhost:8080/uploads/${image.key}`}
        alt="업로드 이미지"
      />
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List {isPublic ? "공개" : "개인"} 사진
      </h3>
      <button onClick={() => setIsPublic((prev) => !prev)}>
        {(isPublic ? "개인" : "공개") + "사진 보기"}
      </button>
      <div className="image-list-container">
        {imgList.length > 0
          ? imgList
          : "사진을 추가하여 갤러리를 완성해보세요!"}
      </div>
    </div>
  );
}
