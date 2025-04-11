import { useRef, useEffect, useContext } from "react";
import styled from "styled-components";
import { useMap } from "../../hooks/useMap";
import { Place } from "../../types/Place";
import { useMapMarker } from "../../context/MapMarkerProvider";
import { useMomentMarker } from "../../context/MomentMarkerProvider";
import useMapClickToAddMarker from "../../hooks/useMapClickToAddMarker";
import useMapPageLogic from "../../hooks/useMapPageLogic";
import RecentSearchList from "./RecentSearchList";
import useRecentSearches from "../../hooks/useRecentSearches";
import useSearchPlaces from "../../hooks/useSearchPlaces";
import SuggestionList from "./SuggestionList";
import SearchInput from "./SearchInput";
import { AuthContext } from "../../context/AuthProvider";
import { saveToLocalRecentSearches } from "../../utils/saveToLocalRecentSearches";
import SkeletonRecentSearches from "./SkeletonRecentSearches";

interface SearchLocationProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (placeId: string) => void;
}

export default function SearchForm({
  setToggle,
  onSelect,
}: SearchLocationProps) {
  const map = useMap();
  const { me } = useContext(AuthContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setSelectedMarker } = useMapMarker();
  const { setSelectedMomentMarker } = useMomentMarker();
  const { clearMarker } = useMapClickToAddMarker({
    map,
    setSelectedMarker,
    setSelectedMomentMarker,
  });
  const { addSearchedMarker } = useMapPageLogic({ setToggle });
  const { keyword, setKeyword, suggestions, searchPlace } = useSearchPlaces();
  const { recentSearches, handleDelete, isLoading } = useRecentSearches();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleItemClick = async (place: Place) => {
    try {
      clearMarker();
      if (me) {
        await searchPlace(place);
      } else {
        saveToLocalRecentSearches(place);
      }
      const centerPosition =
        place.position instanceof kakao.maps.LatLng
          ? place.position
          : new kakao.maps.LatLng(place.position.lat, place.position.lng);
      map.setCenter(centerPosition);
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
      <SearchInput ref={inputRef} keyword={keyword} setKeyword={setKeyword} />
      <StyledList>
        {isLoading ? (
          <SkeletonRecentSearches />
        ) : (
          <RecentSearchList
            places={recentSearches}
            onDelete={handleDelete}
            onClick={handleItemClick}
          />
        )}

        {keyword && suggestions.length > 0 ? (
          <SuggestionList
            suggestions={suggestions}
            onSelect={handleItemClick}
          />
        ) : keyword && suggestions.length === 0 ? (
          <EmptyMessage>
            <span>🔍</span> 일치하는 검색 결과가 없습니다.
          </EmptyMessage>
        ) : null}
      </StyledList>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 16px;
  background-color: #f9f9f9;
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #fff;
  padding: 16px;
  margin-top: 12px;
  border-radius: 12px;
  font-size: 14px;
  color: #777;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
`;
