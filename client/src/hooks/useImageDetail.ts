import { useContext, useEffect, useState } from "react";
import { usePosts } from "../context/PostProvider";
import { axiosInstance } from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthProvider";
import { Post } from "../types/Post";

export default function useImageDetail(postId: string | undefined) {
  const { posts, myPrivatePosts, setPosts, setMyPrivatePosts } = usePosts();
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
      .catch((err) => err.response?.data?.message);
  }, [postId, post]);

  useEffect(() => {
    if (me && post && post.likes.includes(me.userId)) setHasLiked(true);
  }, [me, post]);

  return { post, hasLiked, setHasLiked, me, setPosts, setMyPrivatePosts };
}
