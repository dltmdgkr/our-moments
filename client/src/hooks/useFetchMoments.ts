import { useEffect, useState } from "react";
import { Post } from "../types/Post";
import { axiosInstance } from "../utils/axiosInstance";

export default function useFetchMoments() {
  const [moments, setMoments] = useState<Post[]>([]);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const res = await axiosInstance.get("/images?all=true");

        if (Array.isArray(res.data)) {
          setMoments(res.data);
        } else {
          console.error("Unexpected data format:", res.data);
          setMoments([]);
        }
      } catch (error) {
        setMoments([]);
        console.error("Failed to fetch images:", error);
      }
    };

    fetchMoments();
  }, []);

  return { moments, setMoments };
}
