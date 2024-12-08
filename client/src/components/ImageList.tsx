import { useContext } from "react";
import { ImageContext } from "../context/ImageProvider";
import { Link } from "react-router-dom";
import "./ImageList.css";
import { AuthContext } from "../context/AuthProvider";

export default function ImageList() {
  const {
    images,
    myPrivateImages,
    isPublic,
    setIsPublic,
    loadMoreImages,
    imageLoading,
  } = useContext(ImageContext);
  const { me } = useContext(AuthContext);

  const imgList = (isPublic ? images : myPrivateImages).map((image, index) => (
    <Link key={`${image.key}-${index}`} to={`/images/${image._id}`}>
      <img
        src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
        alt="업로드 이미지"
      />
    </Link>
  ));

  return (
    <>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List {isPublic ? "공개" : "개인"} 사진
      </h3>
      {me && (
        <button onClick={() => setIsPublic((prev) => !prev)}>
          {(isPublic ? "개인" : "공개") + "사진 보기"}
        </button>
      )}
      <div className="image-list-container">
        {imgList.length > 0
          ? imgList
          : "사진을 추가하여 갤러리를 완성해보세요!"}
      </div>
      {imageLoading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={loadMoreImages}>Load More Images</button>
      )}
    </>
  );
}
