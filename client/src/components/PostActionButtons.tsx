interface PostActionButtonsProps {
  hasLiked: boolean;
  likeHandler: () => void;
  deleteHandler: () => void;
  isOwner: boolean;
}

export default function PostActionButtons({
  hasLiked,
  likeHandler,
  deleteHandler,
  isOwner,
}: PostActionButtonsProps) {
  return (
    <>
      <button style={{ float: "right" }} onClick={likeHandler}>
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </button>
      {isOwner && <button onClick={deleteHandler}>삭제</button>}
    </>
  );
}
