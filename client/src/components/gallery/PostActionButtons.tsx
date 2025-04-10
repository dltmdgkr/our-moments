import { FaHeart, FaRegHeart, FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";

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
      <LikeButton onClick={likeHandler} liked={hasLiked}>
        {hasLiked ? <FaHeart /> : <FaRegHeart />}
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </LikeButton>
      {isOwner && (
        <DeleteButton onClick={deleteHandler}>
          <FaTrashAlt />
          삭제
        </DeleteButton>
      )}
    </>
  );
}

export const BaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 18px;
  min-width: 120px;
  border-radius: 9999px;
  font-size: 14.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: #f9fafb;
  color: #374151;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  svg {
    font-size: 16px;
    color: #6b7280;
  }

  &:hover {
    background-color: #f3f4f6;
    transform: translateY(-1px);
    opacity: 0.95;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const LikeButton = styled(BaseButton)<{ liked: boolean }>`
  border: 1px solid #e5e7eb;
  svg {
    color: ${({ liked }) => (liked ? "#6b7280" : "#e11d48")};
  }
`;

const DeleteButton = styled(BaseButton)`
  border: 1px solid #e5e7eb;
  color: #b91c1c;

  svg {
    color: #b91c1c;
  }
`;
