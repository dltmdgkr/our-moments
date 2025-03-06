import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { AuthContext } from "./AuthProvider";

export interface Post {
  _id: string;
  likes: string[];
  user: {
    _id: string;
    name: string;
    username: string;
  };
  images: Image[];
  title: string;
  description: string;
  location: string;
  position: kakao.maps.LatLng;
  public: boolean;
  createdAt: Date;
}

export interface Image {
  _id: string;
  key: string;
  createdAt: Date;
}

interface PostContextType {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  myPrivatePosts: Post[];
  setMyPrivatePosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isPublic: boolean;
  setIsPublic: React.Dispatch<React.SetStateAction<boolean>>;
  loadMorePosts: () => void;
  postLoading: boolean;
}

export const PostContext = createContext<PostContextType>({
  posts: [],
  setPosts: () => {},
  myPrivatePosts: [],
  setMyPrivatePosts: () => {},
  isPublic: false,
  setIsPublic: () => {},
  loadMorePosts: () => {},
  postLoading: false,
});

export default function PostProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [myPrivatePosts, setMyPrivatePosts] = useState<Post[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [postUrl, setPostUrl] = useState("/images");
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const { me } = useContext(AuthContext);
  const pastPostUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (pastPostUrlRef.current === postUrl) return;

    setPostLoading(true);
    axiosInstance
      .get<Post[]>(postUrl)
      .then((result) => {
        if (isPublic) {
          setPosts((prevData) => {
            const newData = result.data.filter(
              (post) =>
                !prevData.some((existingPost) => existingPost._id === post._id)
            );
            return [...prevData, ...newData];
          });
        } else {
          setMyPrivatePosts((prevData) => {
            const newData = result.data.filter(
              (post) =>
                !prevData.some((existingPost) => existingPost._id === post._id)
            );
            return [...prevData, ...newData];
          });
        }
      })
      .catch((err) => console.error("게시글 불러오기 실패:", err))
      .finally(() => {
        setPostLoading(false);
        pastPostUrlRef.current = postUrl;
      });
  }, [postUrl, isPublic]);

  useEffect(() => {
    if (!me) {
      setMyPrivatePosts([]);
      setIsPublic(true);
      return;
    }

    axiosInstance
      .get("/users/me/images")
      .then((result) => {
        setMyPrivatePosts((prevData) => {
          const newData = result.data.filter(
            (post: Post) =>
              !prevData.some((existingPost) => existingPost._id === post._id)
          );
          return [...prevData, ...newData];
        });
      })
      .catch((err) => console.error(err));
  }, [me]);

  const lastPostId = posts.length > 0 ? posts[posts.length - 1]._id : null;

  const loadMorePosts = useCallback(() => {
    if (postLoading || !lastPostId) return;
    setPostUrl(`${isPublic ? "" : "/users/me"}/images?lastId=${lastPostId}`);
  }, [lastPostId, postLoading, isPublic]);

  return (
    <PostContext.Provider
      value={{
        posts,
        setPosts,
        myPrivatePosts,
        setMyPrivatePosts,
        isPublic,
        setIsPublic,
        loadMorePosts,
        postLoading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostProvider");
  }
  return context;
};
