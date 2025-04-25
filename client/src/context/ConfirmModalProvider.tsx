import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ConfirmModalContext = createContext<ModalContextType | null>(null);

export const ConfirmModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ConfirmModalContext.Provider value={{ isOpen, openModal, closeModal }}>
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
