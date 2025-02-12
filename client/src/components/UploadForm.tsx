import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ProgressBar from "./ProgressBar";
import { toast } from "react-toastify";
import "./UploadForm.css";
import { axiosInstance } from "../utils/axiosInstance";
import axios from "axios";
import { PlaceType } from "../map/mapTypes";
import { PostContext } from "../context/PostProvider";

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
        if (inputRef.current) inputRef.current.value = "";
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("이미지 업로드에 실패했습니다.");
      setSelectedMarker(null);
      setTitle("");
      setDescription("");
      setPercent([]);
      setPreviews([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  // const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
  //   e.preventDefault();

  //   if (!files) {
  //     console.error("선택된 파일이 없습니다.");
  //     return;
  //   }

  //   const formData = new FormData();

  //   for (let file of files) formData.append("image", file);
  //   formData.append("public", isPublic.toString());

  //   try {
  //     const res = await axios.post("/images", formData, {
  //       headers: { "content-type": "multipart/form-data" },
  //       onUploadProgress: (e) => {
  //         setPercent(Math.round((100 * e.loaded) / e.total!));
  //       },
  //     });

  //     if (isPublic) {
  //       setImages((prevData) => [...res.data, ...prevData]);
  //     } else {
  //       setMyPrivateImages((prevData) => [...res.data, ...prevData]);
  //     }

  //     toast.success("이미지가 성공적으로 업로드되었습니다!", {
  //       autoClose: 3000,
  //     });

  //     setTimeout(() => {
  //       setPercent(0);
  //       setPreviews([]);
  //     }, 3000);
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("이미지 업로드에 실패했습니다.");
  //     setPercent(0);
  //     setPreviews([]);
  //   }
  // };

  const previewImages = previews.map((preview, index) => (
    <div key={index}>
      <img
        src={preview.imgSrc as string}
        alt="사진첩 이미지 미리보기"
        className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
        style={{ width: 200, height: 200, objectFit: "cover" }}
      />
      <ProgressBar percent={percent[index]} />
    </div>
  ));

  const fileName =
    previewImages.length === 0
      ? "이미지 파일을 업로드 해주세요."
      : previews.reduce(
          (previous, current) => previous + `${current.fileName}, `,
          ""
        );

  return (
    <form
      onSubmit={onSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type="text"
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="내용을 입력하세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
        }}
      >
        {previewImages}
      </div>
      <div className="file-dropper">
        {fileName}
        <input
          ref={inputRef}
          id="image"
          type="file"
          multiple
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </div>
      <input
        type="checkbox"
        id="public-check"
        checked={!isPublic}
        onChange={() => setIsPublic((prev) => !prev)}
      />
      <label htmlFor="public-check">비공개</label>
      <button type="submit" className="submit-btn">
        제출
      </button>
    </form>
  );
}
