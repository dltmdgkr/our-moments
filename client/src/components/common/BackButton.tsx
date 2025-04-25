import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return <BackIcon onClick={handleClick} />;
}

const BackIcon = styled(IoArrowBack)`
  position: fixed;
  top: 20px;
  left: 20px;
  font-size: 24px;
  background-color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;
