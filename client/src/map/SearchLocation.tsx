import { FormEvent, useEffect, useRef, useState } from "react";
import "./SearchLocation.css";
import { useMap } from "../hooks/useMap";
import { PlaceType } from "./mapTypes";

interface SearchLocationProps {
  onUpdatePlaces: (places: PlaceType[]) => void;
}

export default function SearchLocation(props: SearchLocationProps) {
  const map = useMap();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const placeService = useRef<kakao.maps.services.Places | null>(null);

  useEffect(() => {
    if (placeService.current) return;

    placeService.current = new kakao.maps.services.Places();
  }, []);

  const searchPlaces = (keyword: string) => {
    if (!placeService.current) return;

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return;
    }

    placeService.current.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        console.log(data);
        const placeInfos = data.map((placeSearchResultItem) => {
          return {
            id: placeSearchResultItem.id,
            position: new kakao.maps.LatLng(
              Number(placeSearchResultItem.y),
              Number(placeSearchResultItem.x)
            ),
            title: placeSearchResultItem.place_name,
            address: placeSearchResultItem.address_name,
          };
        });

        props.onUpdatePlaces(placeInfos);
        setPlaces(placeInfos);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 존재하지 않습니다.");
        return;
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
        return;
      }
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchPlaces(keyword);
  };

  const handleItemClick = (place: PlaceType) => {
    map.setCenter(place.position);
    map.setLevel(4);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </form>
      <ul>
        {places.map((item, index) => {
          return (
            <li key={item.id} onClick={() => handleItemClick(item)}>
              <span>{`${index + 1}. ${item.title}`}</span>
              <span>{item.address}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
