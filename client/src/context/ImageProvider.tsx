import axios from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "./AuthProvider";

export interface Image {
  key: string;
  _id: string;
  likes: string[];
  user: {
    _id: string;
    name: string;
    username: string;
  };
  public: boolean;
  createdAt: Date;
}
interface ImageContextType {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
  myPrivateImages: Image[];
  setMyPrivateImages: Dispatch<SetStateAction<Image[]>>;
  isPublic: boolean;
  setIsPublic: Dispatch<SetStateAction<boolean>>;
  loadMoreImages: () => void;
  imageLoading: boolean;
}

export const ImageContext = createContext<ImageContextType>({
  images: [],
  setImages: () => {},
  myPrivateImages: [],
  setMyPrivateImages: () => {},
  isPublic: false,
  setIsPublic: () => {},
  loadMoreImages: () => {},
  imageLoading: false,
});

export default function ImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);
  const [myPrivateImages, setMyPrivateImages] = useState<Image[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const { me } = useContext(AuthContext);
  const pastImageUrlRef = useRef<string>();

  useEffect(() => {
    if (pastImageUrlRef.current === imageUrl) return;
    setImageLoading(true);
    axios
      .get(imageUrl)
      .then((result) =>
        isPublic
          ? setImages((prevData) => [...prevData, ...result.data])
          : setMyPrivateImages((prevData) => [...prevData, ...result.data])
      )
      .catch((err) => console.error(err))
      .finally(() => {
        setImageLoading(false);
        pastImageUrlRef.current = imageUrl;
      });
  }, [imageUrl, isPublic]);

  useEffect(() => {
    setTimeout(() => {
      if (me) {
        axios
          .get("/users/me/images")
          .then((result) => setMyPrivateImages(result.data))
          .catch((err) => console.error(err));
      } else {
        setMyPrivateImages([]);
        setIsPublic(true);
      }
    }, 0);
  }, [me]);

  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;

  const loadMoreImages = useCallback(() => {
    if (imageLoading || !lastImageId) return;
    setImageUrl(`${isPublic ? "" : "/users/me"}/images?lastId=${lastImageId}`);
  }, [lastImageId, imageLoading, isPublic]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myPrivateImages,
        setMyPrivateImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
        imageLoading,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
