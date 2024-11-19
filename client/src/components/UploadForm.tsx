import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useRef,
  useState,
} from "react";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageProvider";
import { toast } from "react-toastify";
import "./UploadForm.css";
import { axiosInstance } from "../utils/axiosInstance";
import axios from "axios";

interface Preview {
  imgSrc: string | ArrayBuffer | null;
  fileName: string;
}

export default function UploadForm() {
  const { setImages, setMyPrivateImages } = useContext(ImageContext);
  const [files, setFiles] = useState<File[] | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [percent, setPercent] = useState<number[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const imageSelectHandler: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const imageFiles = e.target.files;

    if (imageFiles && imageFiles.length > 0) {
      const imageArray = Array.from(imageFiles);

      setFiles(imageArray);

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

      setPreviews(imagePreviews);
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!files) return;
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
      });

      if (isPublic) {
        setImages((prevData) => [...res.data, ...prevData]);
      } else {
        setMyPrivateImages((prevData) => [...res.data, ...prevData]);
      }

      toast.success("이미지가 성공적으로 업로드되었습니다!", {
        autoClose: 3000,
      });

      setTimeout(() => {
        setPercent([]);
        setPreviews([]);
        if (inputRef.current) inputRef.current.value = "";
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("이미지 업로드에 실패했습니다.");
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
    <form onSubmit={onSubmit}>
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
