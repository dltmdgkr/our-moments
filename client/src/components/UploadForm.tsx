import axios from "axios";
import { ChangeEventHandler, FormEventHandler, useState } from "react";
import "./UploadForm.css";
import ProgressBar from "./ProgressBar";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("이미지 파일을 업로드 해주세요.");
  const [percent, setPercent] = useState(0);

  const imageSelectHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const imageFile = files[0];
      setFile(imageFile);
      setFileName(imageFile.name);
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
    try {
      const res = await axios.post("/upload", formData, {
        headers: { "content-type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total!));
        },
      });
      console.log(res);
      alert("성공!");
    } catch (err) {
      console.error(err);
      alert("실패");
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <ProgressBar percent={percent} />
      <div className="file-dropper">
        {fileName}
        <input id="image" type="file" onChange={imageSelectHandler} />
      </div>
      <button type="submit" className="submit-btn">
        제출
      </button>
    </form>
  );
}
