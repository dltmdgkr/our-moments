import { FaHeart, FaRegHeart, FaEdit, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { useConfirmModal } from "../../context/ConfirmModalProvider";

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
  const navigate = useNavigate();
  const { postId } = useParams();
  const { openModal } = useConfirmModal();
  return (
    <>
      <LikeButton onClick={likeHandler} liked={hasLiked}>
        {hasLiked ? <FaHeart /> : <FaRegHeart />}
        {hasLiked ? "좋아요 취소" : "좋아요"}
      </LikeButton>
      {isOwner && (
        <>
          <EditButton
            onClick={() => navigate(`/edit/${postId}`, { replace: true })}
          >
            <FaEdit />
            수정
          </EditButton>
          <DeleteButton
            onClick={() =>
              openModal({
                title: "삭제하시겠습니까?",
                description: "삭제된 글은 복구할 수 없습니다.",
                confirmText: "삭제하기",
                cancelText: "취소",
                onConfirm: deleteHandler,
              })
            }
          >
            <FaTrashAlt />
            삭제
          </DeleteButton>
        </>
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

const EditButton = styled(BaseButton)`
  border: 1px solid #e5e7eb;
  color: #0569d6;

  svg {
    color: #0569d6;
  }
`;

const DeleteButton = styled(BaseButton)`
  border: 1px solid #e5e7eb;
  color: #b91c1c;

  svg {
    color: #b91c1c;
  }
`;
