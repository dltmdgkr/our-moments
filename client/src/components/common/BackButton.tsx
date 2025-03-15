import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export default function BackButton() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate(-1);
  };

  return <BackIcon onClick={onClick} />;
}

const BackIcon = styled(IoArrowBack)`
  position: sticky;
  top: 10px;
  left: 0px;
  font-size: 24px;
  background-color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;
