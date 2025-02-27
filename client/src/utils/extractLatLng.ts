export const extractLatLng = (
  position: kakao.maps.LatLng | { lat: number; lng: number }
) => {
  if (position instanceof kakao.maps.LatLng) {
    return { lat: position.getLat(), lng: position.getLng() };
  }
  return { lat: position.lat, lng: position.lng };
};
