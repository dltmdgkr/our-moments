import { useEffect } from "react";
import styled from "styled-components";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <Dialog>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        <ButtonGroup>
          <CancelButton onClick={onCancel}>계속하기</CancelButton>
          <ConfirmButton onClick={onConfirm}>종료하기</ConfirmButton>
        </ButtonGroup>
      </Dialog>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: #ff4d4f;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;

const CancelButton = styled.button`
  flex: 1;
  background: #e0e0e0;
  color: black;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
`;
