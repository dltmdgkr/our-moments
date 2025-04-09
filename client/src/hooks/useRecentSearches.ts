import { useState, useEffect, useContext } from "react";
import { axiosInstance } from "../utils/axiosInstance";
import { Place } from "../types/Place";
import { AuthContext } from "../context/AuthProvider";

export interface RecentSearchedPlace {
  place: Place;
  searchedAt: Date;
}

export default function useRecentSearches() {
  const { me } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<Place[]>([]);

  useEffect(() => {
    const fetchGuestSearches = () => {
      const guest = localStorage.getItem("guestSearches");
      if (!guest) return [];

      const parsed = JSON.parse(guest) as RecentSearchedPlace[];
      return parsed
        .map((item) => item.place)
        .filter((place) => place && place.title);
    };

    const fetchRecentSearches = async () => {
      setIsLoading(true);

      if (!me) {
        const guestPlaces = fetchGuestSearches();
        setRecentSearches(guestPlaces);
        setIsLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/users/searches");
        const serverSearches = res.data.recentSearches
          .map((item: RecentSearchedPlace) => item.place)
          .filter((place: Place | undefined) => place && place.title);

        setRecentSearches(serverSearches);

        const guestPlaces = fetchGuestSearches();
        if (guestPlaces.length > 0) {
          await axiosInstance.post("/users/searches/merge", {
            places: guestPlaces,
          });

          const updatedRes = await axiosInstance.get("/users/searches");
          const merged = updatedRes.data.recentSearches
            .map((item: RecentSearchedPlace) => item.place)
            .filter((place: Place | undefined) => place && place.title);

          setRecentSearches(merged);
        }
      } catch (err) {
        console.error("최근 검색 기록 불러오기 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentSearches();
  }, [me]);

  const handleDelete = async (place: Place) => {
    try {
      setRecentSearches((prev) =>
        prev.filter((recentSearch) => recentSearch.id !== place.id)
      );

      if (me) {
        await deleteSearch(place);
      }

      const guest = localStorage.getItem("guestSearches");
      if (guest) {
        const parsed = JSON.parse(guest) as RecentSearchedPlace[];
        const filtered = parsed.filter((item) => item.place.id !== place.id);
        localStorage.setItem("guestSearches", JSON.stringify(filtered));
      }
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

  return { recentSearches, handleDelete, isLoading };
}
