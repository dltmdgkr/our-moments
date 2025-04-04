import { useEffect, useRef, useState } from "react";
import useDebounce from "./useDebounce";
import { Place } from "../types/Place";
import { axiosInstance } from "../utils/axiosInstance";

export default function useSearchPlaces() {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const debouncedKeyword = useDebounce(keyword, 300);
  const placeService = useRef<kakao.maps.services.Places | null>(null);

  useEffect(() => {
    if (!placeService.current) {
      placeService.current = new kakao.maps.services.Places();
    }
  }, []);

  useEffect(() => {
    if (debouncedKeyword.trim() && placeService.current) {
      placeService.current.keywordSearch(debouncedKeyword, (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const placeInfos = data.map((placeSearchResultItem) => ({
            id: placeSearchResultItem.id,
            position: new kakao.maps.LatLng(
              Number(placeSearchResultItem.y),
              Number(placeSearchResultItem.x)
            ),
            title: placeSearchResultItem.place_name,
            address: placeSearchResultItem.address_name,
          }));

          setSuggestions(placeInfos);
        } else if (status === kakao.maps.services.Status.ERROR) {
          alert("검색 중 오류가 발생했습니다.");
        }
      });
    }
  }, [debouncedKeyword]);

  const searchPlace = async (query: string) => {
    await axiosInstance.post("/users/searches", { query });
  };

  return { keyword, setKeyword, suggestions, searchPlace };
}
