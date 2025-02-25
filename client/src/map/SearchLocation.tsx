import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useMap } from "../hooks/useMap";
import { PlaceType } from "./mapTypes";
import { useMapMarker } from "../context/MapMarkerContext";

interface SearchLocationProps {
  onUpdatePlaces: (places: PlaceType[]) => void;
  onSelect: (placeId: string) => void;
}

export default function SearchLocation(props: SearchLocationProps) {
  const map = useMap();
  const [keyword, setKeyword] = useState("");
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const placeService = useRef<kakao.maps.services.Places | null>(null);
  const { setSelectedMarker } = useMapMarker();

  useEffect(() => {
    if (placeService.current) return;

    placeService.current = new kakao.maps.services.Places();
  }, []);

  const searchPlaces = (keyword: string) => {
    if (!placeService.current) return;

    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    placeService.current.keywordSearch(keyword, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
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
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert("검색 결과 중 오류가 발생했습니다.");
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
    props.onSelect(place.id);
    setSelectedMarker(place);
  };

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </StyledForm>
      <StyledList>
        {places.map((item, index) => (
          <StyledListItem key={item.id} onClick={() => handleItemClick(item)}>
            <span>{`${index + 1}. ${item.title}`}</span>
            <span>{item.address}</span>
          </StyledListItem>
        ))}
      </StyledList>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const StyledForm = styled.form`
  display: flex;
  position: sticky;
  top: 0;
`;

const StyledInput = styled.input`
  width: 100%;
  min-width: 150px;
  padding: 8px;
  border: 1px solid #c0c0c0;
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledListItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-bottom: 1px dashed #d2d2d2;
  cursor: pointer;

  &:hover {
    background-color: #d2d2d2;
    opacity: 1;
    transition: background-color 0s;
  }
`;
