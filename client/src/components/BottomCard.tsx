import { Link } from "react-router-dom";
import { MomentMarkerContextType } from "../context/MomentMarkerProvider";
import { GrNext } from "react-icons/gr";
import styled from "styled-components";

export default function BottomCard({
  selectedMomentMarker,
  setSelectedMomentMarker,
}: MomentMarkerContextType) {
  if (!selectedMomentMarker) return null;

  return (
    <CardContainer>
      <CloseButton onClick={() => setSelectedMomentMarker(null)}>x</CloseButton>
      <MomentImage
        src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${selectedMomentMarker.images[0].key}`}
        alt="moment"
      />
      <InfoContainer>
        <LocationText>{selectedMomentMarker.location}</LocationText>
        <TitleText>{selectedMomentMarker.title}</TitleText>
        <DescriptionText>{selectedMomentMarker.description}</DescriptionText>
      </InfoContainer>
      <LinkContainer>
        <Link to={`/images/${selectedMomentMarker._id}`}>
          <GrNext />
        </Link>
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
  font-size: 16px;
  cursor: pointer;
`;

const MomentImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
`;

const InfoContainer = styled.div`
  flex: 1;
`;

const LocationText = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 2px;
`;

const TitleText = styled.h4`
  margin: 0;
  font-size: 16px;
`;

const DescriptionText = styled.p`
  font-size: 14px;
  color: darkred;
  font-weight: bold;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
