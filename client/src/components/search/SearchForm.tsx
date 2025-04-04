import { useRef, useEffect } from "react";
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

interface SearchLocationProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (placeId: string) => void;
}

export default function SearchForm({
  setToggle,
  onSelect,
}: SearchLocationProps) {
  const map = useMap();
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
  const { recentSearches } = useRecentSearches();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleItemClick = async (place: Place) => {
    try {
      clearMarker();
      await searchPlace(place.title);
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
      <SearchInput ref={inputRef} keyword={keyword} setKeyword={setKeyword} />
      <StyledList>
        {keyword && suggestions.length > 0 ? (
          <SuggestionList
            suggestions={suggestions}
            onSelect={handleItemClick}
          />
        ) : keyword && suggestions.length === 0 ? (
          <div>일치하는 검색 결과가 없습니다.</div>
        ) : null}

        {!keyword && recentSearches.length > 0 && (
          <RecentSearchList items={recentSearches} />
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

const StyledList = styled.ul`
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
`;
