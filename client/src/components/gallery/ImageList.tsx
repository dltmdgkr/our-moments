import { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { usePosts } from "../../context/PostProvider";
import { AuthContext } from "../../context/AuthProvider";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { toast } from "react-toastify";

export default function ImageList() {
  const { me } = useContext(AuthContext);
  const {
    posts,
    myPrivatePosts,
    isPublic,
    setIsPublic,
    loadMorePosts,
    postLoading,
  } = usePosts();

  const handleTogglePublic = () => {
    if (!me) {
      toast.error("로그인 후 이용해주세요.", { autoClose: 2500 });
      return;
    }
    setIsPublic((prev) => !prev);
  };

  const postList = (isPublic ? posts : myPrivatePosts).map((post, index) => (
    <Card key={`${post._id}-${index}`}>
      <StyledLink to={`/images/${post._id}`}>
        {post.images?.length > 0 && (
          <>
            <StyledImage
              src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${post.images[0].key}`}
              alt="업로드 이미지"
            />
            {post.images.length > 1 && (
              <MultipleIconWrapper>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16.014 16.002"
                >
                  <path fill="#fff" d="M0 0H12V12H0z" />
                  <path
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2px"
                    d="M1441-559.716h12.068v-11.669"
                    transform="translate(-1438.053 574.719)"
                  />
                  <path fill="none" d="M0 0H16V16H0z" />
                </svg>
              </MultipleIconWrapper>
            )}
          </>
        )}
        <Overlay>
          <TopMeta>
            <HiOutlineLocationMarker />
            <LocationText>
              {post.location
                ? post.location.split(" ").slice(0, 3).join(" ")
                : "위치 정보 없음"}
            </LocationText>
          </TopMeta>
          <Title>{post.title || "제목 없음"}</Title>
          <Description>{post.description || "설명 없음"}</Description>
        </Overlay>
      </StyledLink>
    </Card>
  ));

  return (
    <Wrapper>
      <Header>
        <TitleText>
          {isPublic ? "🌍 모두의 순간들" : "🔒 나만의 추억들"}
        </TitleText>
        <ToggleButton onClick={handleTogglePublic}>
          {isPublic ? "🔒 개인 사진 보기" : "📂 공개 사진 보기"}
        </ToggleButton>
      </Header>
      <ImageListContainer>
        {postList.length > 0
          ? postList
          : "사진을 추가하여 갤러리를 완성해보세요!"}
      </ImageListContainer>
      {postLoading ? (
        <div>Loading...</div>
      ) : (
        <LoadMoreButton onClick={loadMorePosts}>
          ⬇️ 더 많은 순간들이 숨어있어요
        </LoadMoreButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 80%;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TitleText = styled.h3`
  font-size: 28px;
  font-weight: 600;
  color: #2d2d2d;
  letter-spacing: -0.5px;
`;

const ToggleButton = styled.button`
  cursor: pointer;
  padding: 8px 14px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  color: #444;
  border-radius: 20px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ececec;
    border-color: #aaa;
  }
`;

const ImageListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const Card = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  background-color: #111;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StyledLink = styled(Link)`
  display: block;
  color: inherit;
  text-decoration: none;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
`;

const MultipleIconWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px;

  svg {
    display: block;
  }
`;

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent 60%);
  color: #f1f1f1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  word-break: break-word;
`;

const TopMeta = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 12px;
  color: #ccc;
  margin-bottom: 8px;

  svg {
    margin-right: 4px;
    color: #aaa;
  }
`;

const LocationText = styled.span`
  font-weight: 400;
`;

const Title = styled.h4`
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 4px 0;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const Description = styled.p`
  font-size: 13px;
  color: #ccc;
  margin: 0;
  overflow-wrap: break-word;
  word-break: break-word;
`;

const LoadMoreButton = styled.button`
  margin: 32px auto 0;
  display: block;
  padding: 12px 24px;
  font-size: 15px;
  border: none;
  border-radius: 32px;
  background-color: #1a1a1a;
  color: #fff;
  font-weight: 500;
  transition: transform 0.2s ease, background-color 0.2s ease,
    box-shadow 0.2s ease;
  animation: bounce 2.5s infinite ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #333;
    cursor: pointer;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-4px);
    }
  }
`;
