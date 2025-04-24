import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  isOpen: boolean;
  toggleModal: () => void;
  closeModal: () => void;
}

const MenuModalContext = createContext<ModalContextType | null>(null);

export const MenuModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen((prev) => !prev);
  const closeModal = () => setIsOpen(false);

  return (
    <MenuModalContext.Provider value={{ isOpen, toggleModal, closeModal }}>
      {children}
    </MenuModalContext.Provider>
  );
};

export const useMenuModal = () => {
  const context = useContext(MenuModalContext);
  if (!context) throw new Error("useMenuModal must be used within a Provider");
  return context;
};
