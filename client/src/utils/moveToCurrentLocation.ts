export const moveToCurrentLocation = (
  map: kakao.maps.Map | null | undefined
) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const userPosition = new kakao.maps.LatLng(latitude, longitude);

      if (map) {
        map.setCenter(userPosition);
        map.setLevel(4, { animate: true });
      }
    },
    (error) => console.error("Failed to get location:", error),
    { enableHighAccuracy: true }
  );
};
