import styled from "styled-components";
import ProgressBar from "../common/ProgressBar";
import { Preview } from "./UploadContainer";
import { ChangeEventHandler, FormEventHandler } from "react";
import { GrClose } from "react-icons/gr";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Place } from "../../types/Place";
import { Link } from "react-router-dom";

interface UploadFormProps {
  title: string;
  description: string;
  previews: Preview[];
  percent: number[];
  isPublic: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  selectedMarker: Place | null;
  onSubmit: FormEventHandler<HTMLFormElement>;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setIsPublic: (value: boolean | ((prev: boolean) => boolean)) => void;
  imageSelectHandler: ChangeEventHandler<HTMLInputElement>;
  removePreview: (index: number) => void;
}

export default function UploadForm({
  title,
  description,
  previews,
  percent,
  isPublic,
  inputRef,
  selectedMarker,
  onSubmit,
  setTitle,
  setDescription,
  setIsPublic,
  imageSelectHandler,
  removePreview,
}: UploadFormProps) {
  const isMarkerSelected = selectedMarker !== null;

  return (
    <FormContainer onSubmit={onSubmit}>
      <SectionTitle>📸 오늘 우리의 순간을 지구촌에 공유해주세요</SectionTitle>

      {isMarkerSelected ? (
        <LocationInfo>
          <FaMapMarkerAlt color="#ef5350" />
          <span>
            {selectedMarker.title}
            {selectedMarker.title !== selectedMarker.address && (
              <Address> ({selectedMarker.address})</Address>
            )}
          </span>
        </LocationInfo>
      ) : (
        <WarningBox>
          <FaMapMarkerAlt color="#ef5350" />
          <span>
            위치를 선택해주세요. 지도를 클릭해 장소를 지정할 수 있어요.
          </span>
          <Link to="/">
            <MoveHomeButton>이동하기</MoveHomeButton>
          </Link>
        </WarningBox>
      )}

      <Input
        type="text"
        placeholder="제목을 입력해 주세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextArea
        placeholder="당신의 이야기를 들려주세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <PreviewContainer>
        {previews.map((preview, index) => (
          <ImageWrapper key={index}>
            <CloseButton
              type="button"
              onClick={(e) => {
                e.preventDefault();
                removePreview(index);
              }}
            >
              <GrClose size={16} />
            </CloseButton>
            <ImagePreview src={preview.imgSrc as string} alt="사진 미리보기" />
            <ProgressBar percent={percent[index]} />
          </ImageWrapper>
        ))}
      </PreviewContainer>

      <FileDropper>
        {previews.length === 0 ? (
          "여기에 이미지를 드롭하거나 선택해 주세요"
        ) : (
          <PreviewNames>
            {previews.map((p, i) => (
              <span key={i}>{p.fileName}</span>
            ))}
          </PreviewNames>
        )}
        <FileInput
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={imageSelectHandler}
        />
      </FileDropper>

      <ToggleWrapper>
        <span>🔒 나만 보기</span>
        <input
          type="checkbox"
          checked={!isPublic}
          onChange={() => setIsPublic((prev) => !prev)}
        />
      </ToggleWrapper>

      <SubmitButton type="submit" disabled={!isMarkerSelected}>
        ✨ 올리기
      </SubmitButton>
    </FormContainer>
  );
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 60px;
  padding: 24px;
  background-color: #fefefe;
  border-radius: 16px;
  border: 1px solid #eaeaea;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: #444;
`;

const Address = styled.span`
  color: #888;
  font-weight: 400;
  font-size: 14px;
`;

const WarningBox = styled.div`
  background-color: #fff3cd;
  color: #856404;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const MoveHomeButton = styled.a`
  font-weight: bold;
  text-decoration: underline;
  cursor: pointer;
`;

const Input = styled.input`
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;

  &:focus {
    border-color: #a0a0a0;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: #a0a0a0;
    outline: none;
  }
`;

const FileDropper = styled.div`
  border: 2px dashed #ccc;
  border-radius: 12px;
  height: 220px;
  background-color: #fdfdfd;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 15px;
  color: #666;
  text-align: center;
  padding: 12px;
`;

const FileInput = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  position: absolute;
  cursor: pointer;
`;

const PreviewNames = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
  max-height: 180px;
  overflow-y: auto;
`;

const PreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const ImageWrapper = styled.div`
  position: relative;
  text-align: center;
  display: inline-block;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.85);
  }
`;

const ImagePreview = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
`;

const SubmitButton = styled.button`
  height: 45px;
  border-radius: 10px;
  background-color: #ffa500;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #ff8c00;
  }
`;

const ToggleWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
`;
