import { NavigateFunction } from "react-router-dom";
import { toast } from "react-toastify";
import { Post } from "../context/PostProvider";

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
      toast.error("위치 정보를 찾을 수 없습니다.");
      return;
    }

    navigate("/", { state: { position } });
    setSelectedMomentMarker(null);
  };
  return <button onClick={moveToLocation}>위치 보기</button>;
}
