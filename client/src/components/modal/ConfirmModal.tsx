import styled from "styled-components";
import { useConfirmModal } from "../../context/ConfirmModalProvider";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "../common/ConfirmDialog";

export const ConfirmModal = () => {
  const { isOpen, closeModal } = useConfirmModal();
  const navigate = useNavigate();

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="작성을 종료하시겠습니까?"
      description="작성 중이신 내용은 삭제됩니다."
      onConfirm={() => {
        closeModal();
        navigate(-1);
      }}
      onCancel={closeModal}
    />
  );
};
