import { FormEventHandler, useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import { PostContext } from "../context/PostProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Place } from "../types/Place";
import { Preview } from "../components/gallery/UploadContainer";

interface usePresignedUploadProps {
  files: File[] | null;
  position: { lat: number; lng: number } | null;
  selectedMarker: Place | null;
  setSelectedMarker: (place: Place | null) => void;
  setPreviews: (previews: Preview[]) => void;
}

export default function usePresignedUpload({
  files,
  position,
  selectedMarker,
  setSelectedMarker,
  setPreviews,
}: usePresignedUploadProps) {
  const { setPosts, setMyPrivatePosts } = useContext(PostContext);
  const [percent, setPercent] = useState<number[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || description.trim() === "") {
      toast.error("제목과 내용을 입력해주세요.", { autoClose: 3000 });
      return;
    }
    if (!files) {
      toast.error("사진을 업로드 해주세요.", { autoClose: 3000 });
      return;
    }
    try {
      const presignedData = await axiosInstance.post("/images/presigned", {
        contentTypes: [...files].map((file) => file.type),
      });

      await Promise.all(
        [...files].map((file, index) => {
          const { presigned } = presignedData.data[index];

          const formData = new FormData();

          for (const key in presigned.fields) {
            formData.append(key, presigned.fields[key]);
          }

          formData.append("Content-Type", file.type);
          formData.append("file", file);

          return axios.post(presigned.url, formData, {
            onUploadProgress: (e) => {
              setPercent((prevData) => {
                const newData = [...prevData];
                newData[index] = Math.round((100 * e.loaded) / e.total!);
                return newData;
              });
            },
          });
        })
      );

      const res = await axiosInstance.post("/images", {
        images: [...files].map((file, index) => ({
          imageKey: presignedData.data[index].imageKey,
          originalname: file.name,
        })),
        public: isPublic,
        title,
        description,
        location: selectedMarker?.address,
        position,
      });

      if (isPublic) {
        setPosts((prevData) => [res.data, ...prevData]);
      } else {
        setMyPrivatePosts((prevData) => [res.data, ...prevData]);
      }

      toast.success("이미지가 성공적으로 업로드되었습니다!", {
        autoClose: 3000,
      });

      setTimeout(() => {
        setSelectedMarker(null);
        setTitle("");
        setDescription("");
        setPercent([]);
        setPreviews([]);
        setIsPublic(true);
        if (inputRef.current) inputRef.current.value = "";
        navigate("/", { state: { position } });
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("이미지 업로드에 실패했습니다.", { autoClose: 3000 });
      setSelectedMarker(null);
      setTitle("");
      setDescription("");
      setPercent([]);
      setPreviews([]);
      setIsPublic(true);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return {
    title,
    description,
    percent,
    isPublic,
    inputRef,
    onSubmit,
    setTitle,
    setDescription,
    setIsPublic,
  };
}
