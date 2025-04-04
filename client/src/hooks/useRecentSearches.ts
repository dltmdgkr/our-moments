import { useState, useEffect } from "react";
import { axiosInstance } from "../utils/axiosInstance";

export default function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

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

  return { recentSearches };
}
