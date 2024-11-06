import { useContext, useEffect, useState } from "react";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { Image, ImageContext } from "../context/ImageProvider";
import axios from "axios";
import { AuthContext } from "../context/AuthProvider";
import { toast } from "react-toastify";

export default function ImageDetailPage() {
  const { imageId } = useParams();
  const { images, myPrivateImages, setImages, setMyPrivateImages } =
    useContext(ImageContext);
  const { me } = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const navigate = useNavigate();

  const image =
    images.find((image) => image._id === imageId) ||
    myPrivateImages.find((image) => image._id === imageId);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) setHasLiked(true);
  }, [me, image]);

  if (!image) return <div>Loading...</div>;

  const updateImage = (images: Image[], image: Image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const likeHandler = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );

    if (result.data.public) setImages(updateImage(images, result.data));
    else setMyPrivateImages(updateImage(myPrivateImages, result.data));

    setHasLiked((prev) => !prev);
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말로 삭제하시겠습니까?")) return;
      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message, { autoClose: 3000 });
      setImages(images.filter((image) => image._id !== imageId));
      setMyPrivateImages(images.filter((image) => image._id !== imageId));
      navigate("/");
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
    }
  };

  return (
    <div>
      <h3>ImageDetailPage {imageId}</h3>
      <img
        style={{ width: "100%" }}
        src={`http://localhost:8080/uploads/${image.key}`}
        alt={`image-${imageId}`}
      />
      <div>좋아요 {image.likes.length}</div>
      <button style={{ float: "right" }} onClick={likeHandler}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {me && image.user._id === me.userId && (
        <button onClick={deleteHandler}>삭제</button>
      )}
    </div>
  );
}
