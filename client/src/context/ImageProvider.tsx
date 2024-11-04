import axios from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthProvider";

export interface Image {
  key: string;
}
interface ImageContextType {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
  myPrivateImages: Image[];
  setMyPrivateImages: Dispatch<SetStateAction<Image[]>>;
  isPublic: boolean;
  setIsPublic: Dispatch<SetStateAction<boolean>>;
}

export const ImageContext = createContext<ImageContextType>({
  images: [],
  setImages: () => {},
  myPrivateImages: [],
  setMyPrivateImages: () => {},
  isPublic: false,
  setIsPublic: () => {},
});

export default function ImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);
  const [myPrivateImages, setMyPrivateImages] = useState<Image[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const { me } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (me) {
        axios
          .get("/users/me/images")
          .then((result) => setMyPrivateImages(result.data))
          .catch((err) => console.error(err));
      } else {
        setMyPrivateImages([]);
        setIsPublic(false);
      }
    }, 0);
  }, [me]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myPrivateImages,
        setMyPrivateImages,
        isPublic,
        setIsPublic,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}
