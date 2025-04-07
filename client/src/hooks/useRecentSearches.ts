import { useState, useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { Place } from "../types/Place";

export interface RecentSearchedPlace {
  place: Place;
  searchedAt: Date;
}

export default function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<Place[]>([]);

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const res = await axiosInstance.get("/users/searches");
        setRecentSearches(
          res.data.recentSearches
            .map((recentSearch: RecentSearchedPlace) => recentSearch.place)
            .filter((place: Place | undefined) => place && place.title)
        );
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecentSearches();
  }, []);

  const handleDelete = async (place: Place) => {
    try {
      setRecentSearches(
        recentSearches.filter((recentSearch) => recentSearch !== place)
      );
      await deleteSearch(place);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSearch = async (place: Place) => {
    try {
      await axiosInstance.delete("/users/searches", { data: { place } });
    } catch (err) {
      console.error(err);
    }
  };

  return { recentSearches, handleDelete };
}
