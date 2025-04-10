import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import { Post } from "../../types/Post";
import { FaMapMarkerAlt } from "react-icons/fa";
import styled from "styled-components";
import { BaseButton } from "./PostActionButtons";

interface MoveToLocationButtonProps {
  position: kakao.maps.LatLng;
  navigate: NavigateFunction;
  setSelectedMomentMarker: (post: Post | null) => void;
}

export default function MoveToLocationButton({
  position,
  navigate,
  setSelectedMomentMarker,
}: MoveToLocationButtonProps) {
  const moveToLocation = () => {
    if (!position) {
      toast.error("위치 정보를 찾을 수 없습니다.", { autoClose: 3000 });
      return;
    }

    navigate("/", { state: { position } });
    setSelectedMomentMarker(null);
  };

  return (
    <LocationButton onClick={moveToLocation}>
      <FaMapMarkerAlt />
      위치 보기
    </LocationButton>
  );
}

const LocationButton = styled(BaseButton)`
  color: #374151;
  border: 1px solid #e5e7eb;

  svg {
    color: #0077cc;
  }
`;
