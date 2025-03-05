import { useEffect, useRef } from "react";
import { extractLatLng } from "../utils/extractLatLng";
import { Post } from "../context/PostProvider";

interface useMomentMarkersWithClickProps {
  map: kakao.maps.Map;
  moments: Post[];
  setSelectedMomentMarker: (post: Post | null) => void;
}

export default function useMomentMarkersWithClick({
  map,
  moments,
  setSelectedMomentMarker,
}: useMomentMarkersWithClickProps) {
  const markersRef = useRef<kakao.maps.Marker[]>([]);

  useEffect(() => {
    if (!map || moments.length === 0) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    moments.forEach((moment) => {
      if (!moment.position) return;

      const { lat, lng } = extractLatLng(moment.position);
      const markerPosition = new kakao.maps.LatLng(lat, lng);

      const imageSrc = "/moment_marker.gif";
      const imageSize = new kakao.maps.Size(28, 35);
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

      const marker = new kakao.maps.Marker({
        position: markerPosition,
        map: map,
        image: markerImage,
      });

      markersRef.current.push(marker);

      kakao.maps.event.addListener(marker, "click", () => {
        map.setCenter(markerPosition);
        map.setLevel(4, { animate: true });

        setSelectedMomentMarker({
          _id: moment._id,
          title: moment.title,
          position: moment.position,
          location: moment.location,
          images: moment.images || [],
          description: moment.description,
          likes: moment.likes,
          user: moment.user,
          createdAt: moment.createdAt,
          public: moment.public,
        });
      });
    });
  }, [map, moments, setSelectedMomentMarker]);
}
