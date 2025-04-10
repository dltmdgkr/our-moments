import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/common/BackButton";
import { useMomentMarker } from "../context/MomentMarkerProvider";
import ImageDetailGallery from "../components/gallery/ImageDetailGallery";
import useImageDetail from "../hooks/useImageDetail";
import LocationInfo from "../components/gallery/LocationInfo";
import PostActionButtons from "../components/gallery/PostActionButtons";
import { deleteHandler, likeHandler } from "../utils/postActions";
import MoveToLocationButton from "../components/gallery/MoveToLocationButton";
import styled from "styled-components";

export default function ImageDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { post, hasLiked, setHasLiked, me, setPosts, setMyPrivatePosts } =
    useImageDetail(postId);
  const { setSelectedMomentMarker } = useMomentMarker();

  function formatDate(dateString: Date) {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일의 기록`;
  }

  if (!post) return <div>Loading...</div>;

  return (
    <>
      <GalleryWrapper>
        <ImageDetailGallery images={post.images} />
        <BackButton />
      </GalleryWrapper>

      <Content>
        <Title>{post.title}</Title>

        <InfoBlock>
          <LocationText>{post.location}</LocationText>
          {post.createdAt && (
            <VisitedDate>{formatDate(post.createdAt)}</VisitedDate>
          )}
        </InfoBlock>

        <Description>{post.description}</Description>

        <PostFooter>
          <LikeCount>❤️ 좋아요 · {post.likes.length}</LikeCount>

          <ButtonGroup>
            <MoveToLocationButton
              position={post.position}
              navigate={navigate}
              setSelectedMomentMarker={setSelectedMomentMarker}
            />

            <PostActionButtons
              hasLiked={hasLiked}
              likeHandler={() =>
                likeHandler({
                  postId,
                  hasLiked,
                  me,
                  setHasLiked,
                  setPosts,
                  setMyPrivatePosts,
                })
              }
              deleteHandler={() =>
                deleteHandler({
                  postId,
                  post,
                  setPosts,
                  setMyPrivatePosts,
                  navigate,
                  setSelectedMomentMarker,
                })
              }
              isOwner={post.user._id === me?.userId}
            />
          </ButtonGroup>
        </PostFooter>
      </Content>
    </>
  );
}

const GalleryWrapper = styled.div`
  position: relative;
`;

const Content = styled.div`
  padding: 28px 20px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 24px;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 28px;
`;

const LocationText = styled.div`
  font-size: 16px;
  color: #3d3d3d;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;

  &::before {
    content: "📍";
  }
`;

const VisitedDate = styled.div`
  font-size: 14px;
  color: #777;
  font-weight: 400;
  margin-left: 2px;

  &::before {
    content: "🕓 ";
    margin-right: 4px;
  }
`;

const Description = styled.p`
  white-space: pre-wrap;
  word-break: break-word;
  background: #f8f8f8;
  padding: 20px 22px;
  border-radius: 14px;
  margin-bottom: 40px;
  font-size: 16px;
  color: #2e2e2e;
  line-height: 1.75;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const LikeCount = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #666;
  margin-bottom: 16px;
`;

const PostFooter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eaeaea;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  width: 100%;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
