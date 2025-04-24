import { FormEventHandler, useRef, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import { usePosts } from "../context/PostProvider";
import axios from "axios";
import { Preview } from "../components/gallery/UploadContainer";
import { Post } from "../types/Post";

interface useEditUploadProps {
  originalPost: Post | null;
  files: File[] | null;
  setPreviews: (previews: Preview[]) => void;
}

export default function useEditUpload({
  originalPost,
  files,
  setPreviews,
}: useEditUploadProps) {
  const { setPosts, setMyPrivatePosts } = usePosts();
  const [title, setTitle] = useState(originalPost?.title);
  const [description, setDescription] = useState(originalPost?.description);
  const [isPublic, setIsPublic] = useState(originalPost?.public);
  const [percent, setPercent] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onEditSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (title?.trim() === "" || description?.trim() === "") {
      toast.error("제목과 내용을 입력해주세요.", { autoClose: 3000 });
      return;
    }
    if (!files || files.length === 0) {
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

      const res = await axiosInstance.post(`/images/${originalPost?._id}`, {
        title,
        description,
        location: originalPost?.location,
        position: originalPost?.position,
        images: [...files].map((file, index) => ({
          imageKey: presignedData.data[index].imageKey,
          originalname: file.name,
        })),
        public: isPublic,
      });

      if (isPublic) {
        setPosts((prevData) => [res.data, ...prevData]);
      } else {
        setMyPrivatePosts((prevData) => [res.data, ...prevData]);
      }

      toast.success("게시글이 수정되었습니다.", {
        autoClose: 3000,
      });

      setTimeout(() => {
        setTitle("");
        setDescription("");
        setPercent([]);
        setPreviews([]);
        setIsPublic(true);
        if (inputRef.current) inputRef.current.value = "";
        window.location.replace(`/images/${originalPost?._id}`);
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("이미지 업로드에 실패했습니다.", { autoClose: 3000 });
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
    onEditSubmit,
    setTitle,
    setDescription,
    setIsPublic,
  };
}
