import { useEffect, useState } from "react";
import { Post } from "../context/PostProvider";
import { axiosInstance } from "../utils/axiosInstance";

export default function useMoments() {
  const [moments, setMoments] = useState<Post[]>([]);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const res = await axiosInstance.get("/images");
        setMoments(res.data);
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchMoments();
  }, []);

  return { moments, setMoments };
}
