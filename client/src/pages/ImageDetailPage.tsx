import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import { HiOutlineLocationMarker } from "react-icons/hi";
import styled from "styled-components";
import { Post, PostContext } from "../context/PostProvider";
import BackButton from "../components/BackButton";

export default function ImageDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { posts, myPrivatePosts, setPosts, setMyPrivatePosts } =
    useContext(PostContext);
  const { me } = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    const post =
      posts.find((post) => post._id === postId) ||
      myPrivatePosts.find((post) => post._id === postId);
    if (post) setPost(post);
  }, [posts, myPrivatePosts, postId]);

  useEffect(() => {
    if (post && post._id === postId) return;
    axiosInstance
      .get(`/images/${postId}`)
      .then((result) => setPost(result.data))
      .catch((err) => toast.error(err.response.data.message));
  }, [postId, post]);

  useEffect(() => {
    if (me && post && post.likes.includes(me.userId)) setHasLiked(true);
  }, [me, post]);

  if (!post) return <div>Loading...</div>;

  const updatePost = (posts: Post[], post: Post) =>
    [...posts.filter((post) => post._id !== postId), post].sort((a, b) => {
      if (a._id < b._id) return 1;
      else return -1;
    });

  // const likeHandler = async () => {
  //   const result = await axios.patch(
  //     `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
  //   );

  //   if (result.data.public)
  //     setImages((prevData) => updateImage(prevData, result.data));
  //   setMyPrivateImages((prevData) => updateImage(prevData, result.data));

  //   setHasLiked((prev) => !prev);
  // };

  const likeHandler = async () => {
    if (!me) {
      toast.warn("로그인이 필요합니다.", { autoClose: 3000 });
      return;
    }

    try {
      const result = await axiosInstance.patch(
        `/images/${postId}/${hasLiked ? "unlike" : "like"}`
      );
      const updatedPost = result.data;

      if (updatedPost.public) {
        setPosts((prevPosts) => updatePost(prevPosts, updatedPost));
        if (!updatedPost.public)
          setMyPrivatePosts((prevPosts) =>
            prevPosts.filter((post) => post._id !== updatedPost._id)
          );
      } else {
        setMyPrivatePosts((prevPosts) => updatePost(prevPosts, updatedPost));
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== updatedPost._id)
        );
      }

      setHasLiked((prev) => !prev);
    } catch (err) {
      toast.error("Failed to update like status");
    }
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말로 삭제하시겠습니까?")) return;
      const result = await axiosInstance.delete(`/images/${postId}`);
      toast.success(result.data.message, { autoClose: 3000 });

      if (post?.public) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        setMyPrivatePosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      }

      navigate("/");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  const moveToLocation = () => {
    if (!post?.position) {
      toast.error("위치 정보를 찾을 수 없습니다.");
      return;
    }

    navigate("/", { state: { position: post.position } });
  };

  return (
    <div>
      <BackButton />
      <h3>ImageDetailPage {postId}</h3>
      {post.images.map((image) => (
        <img
          key={image._id}
          style={{ width: "100%" }}
          src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
          alt={`image-${image._id}`}
        />
      ))}
      <LocationWrapper>
        <HiOutlineLocationMarker />
        <LocationText>{post.location}</LocationText>
      </LocationWrapper>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      <div>좋아요 {post.likes.length}</div>
      <button onClick={moveToLocation}>위치 보기</button>
      <button style={{ float: "right" }} onClick={likeHandler}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {me && post.user._id === me.userId && (
        <button onClick={deleteHandler}>삭제</button>
      )}
    </div>
  );
}

const LocationWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  color: #6c757d;
  gap: 4px;
`;

const LocationText = styled.span`
  display: inline-block;
`;
