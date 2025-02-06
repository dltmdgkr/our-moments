import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Image, ImageContext } from "../context/ImageProvider";
import { AuthContext } from "../context/AuthProvider";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import { HiOutlineLocationMarker } from "react-icons/hi";
import styled from "styled-components";

export default function ImageDetailPage() {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const { images, myPrivateImages, setImages, setMyPrivateImages } =
    useContext(ImageContext);
  const { me } = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState<Image>();

  useEffect(() => {
    const img =
      images.find((image) => image._id === imageId) ||
      myPrivateImages.find((image) => image._id === imageId);
    if (img) setImage(img);
  }, [images, myPrivateImages, imageId]);

  useEffect(() => {
    if (image && image._id === imageId) return;
    axiosInstance
      .get(`/images/${imageId}`)
      .then((result) => setImage(result.data))
      .catch((err) => toast.error(err.response.data.message));
  }, [imageId, image]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);

  if (!image) return <div>Loading...</div>;

  const updateImage = (images: Image[], image: Image) =>
    [...images.filter((image) => image._id !== imageId), image].sort((a, b) => {
      if (a._id < b._id) return 1;
      else return -1;
    });

  // const likeHandler = async () => {
  //   const result = await axios.patch(
  //     `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
  //   );

  //   if (result.data.public)
  //     setImages((prevData) => updateImage(prevData, result.data));
  //   setMyPrivateImages((prevData) => updateImage(prevData, result.data));

  //   setHasLiked((prev) => !prev);
  // };
  const likeHandler = async () => {
    try {
      const result = await axiosInstance.patch(
        `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
      );
      const updatedImage = result.data;

      if (updatedImage.public) {
        setImages((prevImages) => updateImage(prevImages, updatedImage));
        if (!updatedImage.public)
          setMyPrivateImages((prevImages) =>
            prevImages.filter((img) => img._id !== updatedImage._id)
          );
      } else {
        setMyPrivateImages((prevImages) =>
          updateImage(prevImages, updatedImage)
        );
        setImages((prevImages) =>
          prevImages.filter((img) => img._id !== updatedImage._id)
        );
      }

      setHasLiked((prev) => !prev);
    } catch (err) {
      toast.error("Failed to update like status");
    }
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말로 삭제하시겠습니까?")) return;
      const result = await axiosInstance.delete(`/images/${imageId}`);
      toast.success(result.data.message, { autoClose: 3000 });

      if (image?.public) {
        setImages((prevImages) =>
          prevImages.filter((img) => img._id !== imageId)
        );
      } else {
        setMyPrivateImages((prevImages) =>
          prevImages.filter((img) => img._id !== imageId)
        );
      }

      navigate("/");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  const moveToLocation = () => {
    if (!image?.position) {
      toast.error("위치 정보를 찾을 수 없습니다.");
      return;
    }

    navigate("/", { state: { position: image.position } });
  };

  return (
    <div>
      <h3>ImageDetailPage {imageId}</h3>
      <img
        style={{ width: "100%" }}
        src={`https://in-ourmoments.s3.ap-northeast-2.amazonaws.com/raw/${image.key}`}
        alt={`image-${imageId}`}
      />
      <LocationWrapper>
        <HiOutlineLocationMarker />
        <LocationText>{image.location}</LocationText>
      </LocationWrapper>
      <h2>{image.title}</h2>
      <p>{image.description}</p>
      <div>좋아요 {image.likes.length}</div>
      <button onClick={moveToLocation}>위치 보기</button>
      <button style={{ float: "right" }} onClick={likeHandler}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {me && image.user._id === me.userId && (
        <button onClick={deleteHandler}>삭제</button>
      )}
    </div>
  );
}

const LocationWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  color: #6c757d;
  gap: 4px;
`;

const LocationText = styled.span`
  display: inline-block;
`;
