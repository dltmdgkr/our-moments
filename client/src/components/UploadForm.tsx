import axios from "axios";
import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useState,
} from "react";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageProvider";
import { toast } from "react-toastify";
import "./UploadForm.css";

export default function UploadForm() {
  const { images, setImages, myPrivateImages, setMyPrivateImages } =
    useContext(ImageContext);
  const defaultFileName = "이미지 파일을 업로드 해주세요.";
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState(defaultFileName);
  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(false);

  const imageSelectHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageFile = files[0];
      setFile(imageFile);
      setFileName(imageFile.name);
      const fileReader = new FileReader();
      fileReader.readAsDataURL(imageFile);
      fileReader.onload = (e) => setImgSrc(e.target?.result as string);
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!file) {
      console.error("선택된 파일이 없습니다.");
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    formData.append("public", isPublic.toString());
    try {
      const res = await axios.post("/images", formData, {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total!));
        },
      });

      if (isPublic) setImages([...images, res.data]);
      else setMyPrivateImages([...myPrivateImages, res.data]);

      toast.success("이미지가 성공적으로 업로드되었습니다!", {
        autoClose: 3000,
      });

      setTimeout(() => {
        setPercent(0);
        setFileName(defaultFileName);
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      toast.error("이미지 업로드에 실패했습니다.");
      setPercent(0);
      setFileName(defaultFileName);
      setImgSrc(null);
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      {imgSrc ? (
        <img
          src={imgSrc}
          alt="사진첩 이미지 미리보기"
          className={`image-preview ${imgSrc && "image-preview-show"}`}
        />
      ) : null}
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input
          id="image"
          type="file"
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
