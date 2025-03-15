import { Image } from "./Image";

export interface Post {
  _id: string;
  likes: string[];
  user: {
    _id: string;
    name: string;
    username: string;
  };
  images: Image[];
  title: string;
  description: string;
  location: string;
  position: kakao.maps.LatLng;
  public: boolean;
  createdAt: Date;
}
