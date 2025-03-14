import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";
import { useMomentMarker } from "../context/MomentMarkerProvider";
import ImageDetailGallery from "../components/ImageDetailGallery";
import useImageDetail from "../hooks/useImageDetail";
import LocationInfo from "../components/LocationInfo";
import PostActionButtons from "../components/PostActionButtons";
import { deleteHandler, likeHandler } from "../utils/postActions";
import MoveToLocationButton from "../components/MoveToLocationButton";

export default function ImageDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { post, hasLiked, setHasLiked, me, setPosts, setMyPrivatePosts } =
    useImageDetail(postId);
  const { setSelectedMomentMarker } = useMomentMarker();

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <BackButton />
      <h3>ImageDetailPage {postId}</h3>
      <ImageDetailGallery images={post.images} />
      <LocationInfo location={post.location} />
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <div>좋아요 {post.likes.length}</div>
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
    </div>
  );
}
