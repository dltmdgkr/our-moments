import { useContext } from "react";
import { Link } from "react-router-dom";
import "./ImageList.css";
import { PostContext } from "../context/PostProvider";
import { AuthContext } from "../context/AuthProvider";

export default function ImageList() {
  const { me } = useContext(AuthContext);
  const {
    posts,
    myPrivatePosts,
    isPublic,
    setIsPublic,
    loadMorePosts,
    postLoading,
  } = useContext(PostContext);

  const handleTogglePublic = () => {
    if (!me) {
      alert("로그인 후 이용해주세요!");
      return;
    }
    setIsPublic((prev) => !prev);
  };

  const postList = (isPublic ? posts : myPrivatePosts).map((post, index) => (
    <Link key={`${post._id}-${index}`} to={`/images/${post._id}`}>
      <img
        src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${post.images[0].key}`}
        alt="업로드 이미지"
      />
    </Link>
  ));

  return (
    <>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List {isPublic ? "공개" : "개인"} 사진
      </h3>
      <button onClick={handleTogglePublic}>
        {(isPublic ? "개인" : "공개") + "사진 보기"}
      </button>
      <div className="image-list-container">
        {postList.length > 0
          ? postList
          : "사진을 추가하여 갤러리를 완성해보세요!"}
      </div>
      {postLoading ? (
        <div>Loading...</div>
      ) : (
        <button onClick={loadMorePosts}>Load More Posts</button>
      )}
    </>
  );
}
