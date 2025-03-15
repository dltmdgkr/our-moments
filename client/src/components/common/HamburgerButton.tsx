import { GiHamburgerMenu } from "react-icons/gi";
import styled from "styled-components";

export default function HamburgerButton({
  showModal,
  position,
}: {
  showModal: () => void;
  position: string;
}) {
  return <StyledHamburgerButton onClick={showModal} position={position} />;
}

const StyledHamburgerButton = styled(GiHamburgerMenu)<{ position: string }>`
  position: ${(props) => props.position};
  top: 10px;
  left: 0px;
  font-size: 24px;
  background-color: white;
  padding: 10px 12px 10px 7px;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
`;
