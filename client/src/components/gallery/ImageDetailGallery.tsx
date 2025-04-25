import styled from "styled-components";
import { useState } from "react";
import { Image } from "../../types/Image";

export default function ImageDetailGallery({ images }: { images: Image[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <Container>
        {images.length > 1 && (
          <>
            <ArrowButton onClick={prevSlide} left>
              ◀
            </ArrowButton>
            <ArrowButton onClick={nextSlide}>▶</ArrowButton>
          </>
        )}
        <Images style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
          {images.map((image) => (
            <Img key={image._id}>
              <img
                style={{ width: "100%", height: "100vh", objectFit: "cover" }}
                src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
                alt="갤러리 이미지"
              />
            </Img>
          ))}
        </Images>
        {images.length > 1 && (
          <IndicatorWrapper>
            {images.map((_, index) => (
              <IndicatorButton
                key={index}
                active={index === currentIndex}
                onClick={() => goToSlide(index)}
              />
            ))}
          </IndicatorWrapper>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  height: 100vh;
`;

const Images = styled.div`
  display: flex;
  width: 100vw;
  transition: transform 0.5s ease-in-out;
`;

const Img = styled.div`
  min-width: 100vw;
`;

const ArrowButton = styled.button<{ left?: boolean }>`
  position: absolute;
  top: 50%;
  ${(props) => (props.left ? "left: 20px;" : "right: 20px;")}
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  color: white;
  font-size: 1.5rem;
  z-index: 10;
  cursor: pointer;

  width: 40px;
  height: 40px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => (props.left ? "padding-right: 10px;" : "padding-left: 10px;")}

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const IndicatorWrapper = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
`;

const IndicatorButton = styled.button<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background-color: ${({ active }) =>
    active ? "white" : "rgba(255, 255, 255, 0.4)"};
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    transform: scale(1.4);
    background-color: ${({ active }) =>
      active ? "white" : "rgba(255, 255, 255, 0.8)"};
  }
`;
