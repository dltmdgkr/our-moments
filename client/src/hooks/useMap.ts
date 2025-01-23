import { createContext, useContext } from "react";

export const kakaoMapContext = createContext<kakao.maps.Map | null>(null);

export const useMap = () => {
  const kakaoMap = useContext(kakaoMapContext);

  if (!kakaoMap) {
    throw new Error("kakaoMap not found");
  }

  return kakaoMap;
};
