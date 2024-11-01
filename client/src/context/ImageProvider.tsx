import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";

export const ImageContext = createContext<
  [Image[], React.Dispatch<React.SetStateAction<Image[]>>]
>([[], () => {}]);

export interface Image {
  key: string;
}

export default function ImageProvider({ children }: { children: ReactNode }) {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    axios
      .get("/images")
      .then((result) => setImages(result.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ImageContext.Provider value={[images, setImages]}>
      {children}
    </ImageContext.Provider>
  );
}
