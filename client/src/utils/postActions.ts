import { toast } from "react-toastify";
import { axiosInstance } from "./axiosInstance";
import { Post } from "../types/Post";
import { NavigateFunction } from "react-router-dom";

interface LikeHandlerProps {
  me: { userId: string } | null;
  postId: string | undefined;
  hasLiked: boolean;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setMyPrivatePosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setHasLiked: React.Dispatch<React.SetStateAction<boolean>>;
}

interface DeleteHandlerProps {
  postId: string | undefined;
  post: Post;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setMyPrivatePosts: React.Dispatch<React.SetStateAction<Post[]>>;
  navigate: NavigateFunction;
  setSelectedMomentMarker: (post: Post | null) => void;
}

const updatePost = (posts: Post[], post: Post, postId: string | undefined) =>
  [...posts.filter((post) => post._id !== postId), post].sort((a, b) => {
    if (a._id < b._id) return 1;
    else return -1;
  });

export const likeHandler = async ({
  me,
  postId,
  hasLiked,
  setPosts,
  setMyPrivatePosts,
  setHasLiked,
}: LikeHandlerProps) => {
  if (!me) {
    toast.error("로그인이 필요합니다.", { autoClose: 3000 });
    return;
  }

  try {
    const result = await axiosInstance.patch(
      `/images/${postId}/${hasLiked ? "unlike" : "like"}`
    );
    const updatedPost = result.data;

    if (updatedPost.public) {
      setPosts((prevPosts) => updatePost(prevPosts, updatedPost, postId));
      if (!updatedPost.public)
        setMyPrivatePosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== updatedPost._id)
        );
    } else {
      setMyPrivatePosts((prevPosts) =>
        updatePost(prevPosts, updatedPost, postId)
      );
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== updatedPost._id)
      );
    }

    setHasLiked((prev) => !prev);
  } catch (err) {
    toast.error("Failed to update like status");
  }
};

export const deleteHandler = async ({
  postId,
  post,
  setPosts,
  setMyPrivatePosts,
  navigate,
  setSelectedMomentMarker,
}: DeleteHandlerProps) => {
  try {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    const result = await axiosInstance.delete(`/images/${postId}`);
    toast.success(result.data.message, { autoClose: 3000 });

    if (post?.public) {
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } else {
      setMyPrivatePosts((prevPosts) =>
        prevPosts.filter((post) => post._id !== postId)
      );
    }

    setSelectedMomentMarker(null);
    navigate("/");
  } catch (err) {
    if (err instanceof Error) toast.error(err.message);
  }
};
