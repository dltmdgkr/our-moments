import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
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
      <StyledImage
        src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${post.images[0].key}`}
        alt="업로드 이미지"
      />
    </Link>
  ));

  return (
    <Wrapper>
      <div>
        <Title>Image List {isPublic ? "공개" : "개인"} 사진</Title>
        <ToggleButton onClick={handleTogglePublic}>
          {(isPublic ? "개인" : "공개") + "사진 보기"}
        </ToggleButton>
      </div>
      <ImageListContainer>
        {postList.length > 0
          ? postList
          : "사진을 추가하여 갤러리를 완성해보세요!"}
      </ImageListContainer>
      {postLoading ? (
        <div>Loading...</div>
      ) : (
        <LoadMoreButton onClick={loadMorePosts}>Load More Posts</LoadMoreButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 50%;
  min-height: 100vh;
  height: 100%;
  margin: 0 auto;
`;

const Title = styled.h3`
  display: inline-block;
  margin-right: 10px;
`;

const ToggleButton = styled.button`
  cursor: pointer;
  padding: 8px 12px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  &:hover {
    background-color: #0056b3;
  }
`;

const ImageListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const StyledImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  transition: opacity 0.2s, box-shadow 0.2s;
  &:hover {
    box-shadow: 4px 4px 4px grey;
    opacity: 0.7;
    cursor: pointer;
  }

  @media (max-width: 835px) {
    min-width: 400px;
    width: 100%;
    height: 200px;
  }

  @media (max-width: 768px) {
    min-width: 300px;
    width: 100%;
    height: 200px;
  }

  @media (max-width: 480px) {
    min-width: 200px;
    width: 100%;
    height: 200px;
  }
`;

const LoadMoreButton = styled.button`
  cursor: pointer;
  padding: 8px 12px;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 10px;
  &:hover {
    background-color: #218838;
  }
`;
