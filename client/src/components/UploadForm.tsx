import styled from "styled-components";
import ProgressBar from "./ProgressBar";
import { Preview } from "./UploadContainer";
import { ChangeEventHandler, FormEventHandler } from "react";

interface UploadFormProps {
  title: string;
  description: string;
  previews: Preview[];
  percent: number[];
  isPublic: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setIsPublic: (value: boolean | ((prev: boolean) => boolean)) => void;
  imageSelectHandler: ChangeEventHandler<HTMLInputElement>;
}

export default function UploadForm({
  title,
  description,
  previews,
  percent,
  isPublic,
  inputRef,
  onSubmit,
  setTitle,
  setDescription,
  setIsPublic,
  imageSelectHandler,
}: UploadFormProps) {
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
