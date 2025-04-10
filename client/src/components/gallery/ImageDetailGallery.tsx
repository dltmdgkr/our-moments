import styled from "styled-components";
import { useState } from "react";
import { Image } from "../../types/Image";

export default function ImageDetailGallery({ images }: { images: Image[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <Container>
        <ArrowButton onClick={prevSlide} left>
          ◀
        </ArrowButton>
        <ArrowButton onClick={nextSlide}>▶</ArrowButton>
        <Images style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
          {images.map((image) => (
            <Img key={image._id}>
              <img
                style={{ width: "100%", height: "100vh", objectFit: "cover" }}
                src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
                alt={`image-${image._id}`}
              />
            </Img>
          ))}
        </Images>
        <IndicatorWrapper>
          {images.map((_, index) => (
            <IndicatorButton
              key={index}
              active={index === currentIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </IndicatorWrapper>
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
  background: inherit;
  border: none;
  color: white;
  font-size: 2rem;
  z-index: 1;
  cursor: pointer;
`;

const IndicatorWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const IndicatorButton = styled.button<{ active: boolean }>`
  width: 36px;
  height: 4px;
  border: none;
  border-radius: 2px;
  background-color: ${({ active }) => (active ? "white" : "gray")};
  opacity: 0.8;
  cursor: pointer;
`;
