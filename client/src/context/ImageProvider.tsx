import axios from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export interface Image {
  key: string;
}
interface ImageContextType {
  images: Image[];
  setImages: Dispatch<SetStateAction<Image[]>>;
}

export const ImageContext = createContext<ImageContextType>({
  images: [],
  setImages: () => {},
});

export default function ImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    axios
      .get("/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ImageContext.Provider value={{ images, setImages }}>
      {children}
    </ImageContext.Provider>
  );
}
