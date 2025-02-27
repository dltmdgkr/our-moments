import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import axios from "axios";
import { PlaceType } from "../map/mapTypes";
import { PostContext } from "../context/PostProvider";
import { useNavigate } from "react-router-dom";

interface Preview {
  imgSrc: string | ArrayBuffer | null;
  fileName: string;
}

interface MarkerContextType {
  selectedMarker: PlaceType | null;
  setSelectedMarker: (place: PlaceType | null) => void;
}

export default function UploadForm({
  selectedMarker,
  setSelectedMarker,
}: MarkerContextType) {
  const { setPosts, setMyPrivatePosts } = useContext(PostContext);
  const [files, setFiles] = useState<File[] | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [percent, setPercent] = useState<number[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMarker) {
      setPosition({
        lat: selectedMarker.position.getLat(),
        lng: selectedMarker.position.getLng(),
      });
    } else {
      setPosition(null);
    }
  }, [selectedMarker]);

  const imageSelectHandler: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const imageFiles = e.target.files;

    if (imageFiles && imageFiles.length > 0) {
      const imageArray = Array.from(imageFiles);

      setFiles((prevFiles) => {
        const newFiles = prevFiles ? [...prevFiles, ...imageArray] : imageArray;
        return newFiles.slice(0, 5);
      });

      const imagePreviews = await Promise.all(
        [...imageArray].map(async (imageFile) => {
          return new Promise<Preview>((resolve, reject) => {
            try {
              const fileReader = new FileReader();

              fileReader.readAsDataURL(imageFile);
              fileReader.onload = (e) =>
                resolve({
                  imgSrc: e.target?.result as string,
                  fileName: imageFile.name,
                });
            } catch (err) {
              reject(err);
            }
          });
        })
      );

      setPreviews((prevPreviews) => {
        const newPreviews = [...prevPreviews, ...imagePreviews];
        return newPreviews.slice(0, 5);
      });
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!files || title.trim() === "" || description.trim() === "") {
      toast.error("제목과 내용을 입력해주세요.");
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
      toast.error("이미지 업로드에 실패했습니다.");
      setSelectedMarker(null);
      setTitle("");
      setDescription("");
      setPercent([]);
      setPreviews([]);
      setIsPublic(true);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <FormContainer onSubmit={onSubmit}>
      <Input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextArea
        placeholder="내용을 입력하세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <PreviewContainer>
        {previews.map((preview, index) => (
          <ImageWrapper key={index}>
            <ImagePreview src={preview.imgSrc as string} alt="사진 미리보기" />
            <ProgressBar percent={percent[index]} />
          </ImageWrapper>
        ))}
      </PreviewContainer>
      <FileDropper>
        {previews.length === 0
          ? "이미지 파일을 업로드 해주세요."
          : previews.map((p) => p.fileName).join(", ")}
        <FileInput
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </FileDropper>
      <Label>
        비공개
        <input
          type="checkbox"
          checked={!isPublic}
          onChange={() => setIsPublic((prev) => !prev)}
        />
      </Label>
      <SubmitButton type="submit">제출</SubmitButton>
    </FormContainer>
  );
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 10px;
`;

const FileDropper = styled.div`
  border: 1px dashed black;
  height: 200px;
  background-color: bisque;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const FileInput = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  cursor: pointer;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ImageWrapper = styled.div`
  text-align: center;
`;

const ImagePreview = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
`;

const SubmitButton = styled.button`
  height: 40px;
  cursor: pointer;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`;
