import { ChangeEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useMap } from "../../hooks/useMap";
import { Place } from "../../types/Place";
import { useMapMarker } from "../../context/MapMarkerProvider";
import { useMomentMarker } from "../../context/MomentMarkerProvider";
import { axiosInstance } from "../../utils/axiosInstance";
import useDebounce from "../../hooks/useDebounce";
import useMapClickToAddMarker from "../../hooks/useMapClickToAddMarker";
import useMapPageLogic from "../../hooks/useMapPageLogic";

interface SearchLocationProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (placeId: string) => void;
}

export default function SearchForm({
  setToggle,
  onSelect,
}: SearchLocationProps) {
  const map = useMap();
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const placeService = useRef<kakao.maps.services.Places | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { setSelectedMarker } = useMapMarker();
  const { setSelectedMomentMarker } = useMomentMarker();
  const debouncedKeyword = useDebounce(keyword, 300);
  const { clearMarker } = useMapClickToAddMarker({
    map,
    setSelectedMarker,
    setSelectedMomentMarker,
  });
  const { addSearchedMarker } = useMapPageLogic({ setToggle });

  useEffect(() => {
    if (placeService.current) return;
    if (inputRef.current) inputRef.current.focus();

    placeService.current = new kakao.maps.services.Places();
  }, []);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const res = await axiosInstance.get("/users/searches");
        setRecentSearches(
          res.data.recentSearches.map((search: any) => search.query)
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecentSearches();
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const handleItemClick = async (place: Place) => {
    try {
      clearMarker();
      await axiosInstance.post("/users/searches", {
        query: place.title,
      });
      map.setCenter(place.position);
      map.setLevel(4);
      onSelect(place.id);
      setSelectedMarker(place);
      setSelectedMomentMarker(null);
      addSearchedMarker(place);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          return;
        }}
      >
        <StyledInput
          ref={inputRef}
          placeholder="장소를 검색하세요..."
          value={keyword}
          onChange={handleInputChange}
        />
      </StyledForm>
      <StyledList>
        {keyword && suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <StyledListItem key={item.id} onClick={() => handleItemClick(item)}>
              <div>
                <ItemTitle>{`${index + 1}. ${item.title}`}</ItemTitle>
                <ItemAddress>{item.address}</ItemAddress>
              </div>
              <ActionText>지도 이동</ActionText>
            </StyledListItem>
          ))
        ) : keyword && suggestions.length === 0 ? (
          <div>일치하는 검색 결과가 없습니다.</div>
        ) : null}

        {!keyword && recentSearches.length > 0 && (
          <>
            <h4>최근 검색어</h4>
            {recentSearches.map((recentSearch, index) => (
              <div key={index}>{recentSearch}</div>
            ))}
          </>
        )}

        {!keyword && recentSearches.length === 0 && (
          <div>최근 검색 내역이 없습니다.</div>
        )}
      </StyledList>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #f9f9f9;
`;

const StyledForm = styled.form`
  display: flex;
  position: sticky;
  top: 0;
  background-color: transparent;
  padding: 0;
  z-index: 10;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.1);

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
`;

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.15s ease-in;

  &:hover {
    background-color: #f0f4ff;
  }
`;

const ItemTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ItemAddress = styled.p`
  font-size: 14px;
  color: #777;
  margin: 4px 0 0;
`;

const ActionText = styled.span`
  font-size: 14px;
  color: #007bff;
  font-weight: 500;
`;
