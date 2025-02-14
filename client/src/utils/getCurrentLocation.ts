export const getCurrentLocation = (map: kakao.maps.Map | null) => {
  if (!navigator.geolocation) {
    console.error("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const userPosition = new kakao.maps.LatLng(latitude, longitude);

      const imageSrc = "/current_location_icon.png";
      const imageSize = new kakao.maps.Size(32, 32);
      const imageOption = { offset: new kakao.maps.Point(10, 10) };

      const markerImage = new kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );
      const marker = new kakao.maps.Marker({
        position: userPosition,
        image: markerImage,
      });

      if (map) {
        marker.setMap(map);
        map.setCenter(userPosition);
        map.setLevel(4, { animate: true });
      }
    },
    (error) => console.error("Failed to get location:", error),
    { enableHighAccuracy: true }
  );
};
