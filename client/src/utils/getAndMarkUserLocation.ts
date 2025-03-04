export const getAndMarkUserLocation = (map: kakao.maps.Map | null) => {
  return new Promise<kakao.maps.LatLng | null>((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported.");
      reject(new Error("Geolocation is not supported."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const userPosition = new kakao.maps.LatLng(latitude, longitude);

        if (map) {
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

          marker.setMap(map);
        }
        resolve(userPosition);
      },
      (error) => {
        console.error("Failed to get location:", error);
        reject(error);
      },
      { enableHighAccuracy: true }
    );
  });
};
