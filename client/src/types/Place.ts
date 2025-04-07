export interface RawPlace {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  address: string;
}

export interface KakaoPlace {
  id: string;
  position: kakao.maps.LatLng;
  title: string;
  address: string;
}

export type Place = RawPlace | KakaoPlace;
