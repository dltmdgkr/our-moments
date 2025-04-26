import { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}
interface ConfirmModalContextType {
  openModal: (props: Omit<ConfirmModalProps, "isOpen">) => void;
  closeModal: () => void;
  state: ConfirmModalProps;
}

const ConfirmModalContext = createContext<ConfirmModalContextType | null>(null);

const initialState: ConfirmModalProps = {
  isOpen: false,
  title: "",
  description: "",
  onConfirm: () => {},
  onCancel: () => {},
};

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ConfirmModalProps>(initialState);

  const openModal = (props: Omit<ConfirmModalProps, "isOpen">) => {
    setState({ isOpen: true, ...props });
  };

  const closeModal = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <ConfirmModalContext.Provider value={{ state, openModal, closeModal }}>
      {children}
    </ConfirmModalContext.Provider>
  );
};

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext);
  if (!context)
    throw new Error("useConfirmModal must be used within a Provider");
  return context;
};
