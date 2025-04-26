import { useConfirmModal } from "../../context/ConfirmModalProvider";
import { ConfirmDialog } from "../common/ConfirmDialog";

export const ConfirmModal = () => {
  const { state, closeModal } = useConfirmModal();
  const {
    isOpen,
    title,
    description,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
  } = state;

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title={title}
      description={description}
      onConfirm={() => {
        onConfirm();
        closeModal();
      }}
      onCancel={() => {
        onCancel?.();
        closeModal();
      }}
      confirmText={confirmText}
      cancelText={cancelText}
    />
  );
};
