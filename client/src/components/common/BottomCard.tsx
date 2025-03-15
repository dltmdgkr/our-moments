import { Link } from "react-router-dom";
import { MomentMarkerContextType } from "../../context/MomentMarkerProvider";
import { GrNext, GrClose } from "react-icons/gr";
import styled from "styled-components";
import { useEffect, useState } from "react";

export default function BottomCard({
  selectedMomentMarker,
  setSelectedMomentMarker,
}: MomentMarkerContextType) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!selectedMomentMarker || selectedMomentMarker.images.length === 0)
      return;

    if (selectedMomentMarker.images.length === 1) {
      setCurrentIndex(0);
      return;
    }

    if (selectedMomentMarker.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % selectedMomentMarker.images.length
        );
      }, 1500);

      return () => {
        clearInterval(interval);
        setCurrentIndex(0);
      };
    }
  }, [selectedMomentMarker]);

  if (!selectedMomentMarker || selectedMomentMarker.images.length === 0)
    return null;

  const currentImage = selectedMomentMarker.images[currentIndex];
  if (!currentImage) return null;

  return (
    <CardContainer>
      <CloseButton onClick={() => setSelectedMomentMarker(null)}>
        <GrClose size={18} />
      </CloseButton>
      <MomentImage
        src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${currentImage.key}`}
        alt="moment"
      />
      <InfoContainer>
        <LocationText>{selectedMomentMarker.location}</LocationText>
        <TitleText>{selectedMomentMarker.title}</TitleText>
        <DescriptionText>{selectedMomentMarker.description}</DescriptionText>
      </InfoContainer>
      <LinkContainer>
        <StyledLink to={`/images/${selectedMomentMarker._id}`}>
          <GrNext size={20} />
        </StyledLink>
      </LinkContainer>
    </CardContainer>
  );
}

const CardContainer = styled.div`
  position: fixed;
  z-index: 5;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 12px;
  display: flex;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const MomentImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 10px;
`;

const InfoContainer = styled.div`
  flex: 1;
  overflow: hidden;
`;

const LocationText = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 2px;
  white-space: nowrap;
`;

const TitleText = styled.h4`
  margin: 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const DescriptionText = styled.p`
  font-size: 14px;
  color: darkred;
  font-weight: bold;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background 0.2s;

  &:visited {
    color: inherit;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;
