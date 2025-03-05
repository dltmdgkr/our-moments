import { HiOutlinePlusSm } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import { MdMyLocation } from "react-icons/md";
import styled from "styled-components";

interface MapControlsProps {
  onSearchToggle: () => void;
  onUpload: () => void;
  onLocation: () => void;
}

export default function MapControls({
  onSearchToggle,
  onUpload,
  onLocation,
}: MapControlsProps) {
  return (
    <>
      <FloatingButton bottom="140px" onClick={onUpload}>
        <HiOutlinePlusSm />
      </FloatingButton>
      <FloatingButton bottom="80px" onClick={onSearchToggle}>
        <IoSearch />
      </FloatingButton>
      <FloatingButton bottom="20px" onClick={onLocation}>
        <MdMyLocation />
      </FloatingButton>
    </>
  );
}

const FloatingButton = styled.div<{ bottom: string }>`
  position: absolute;
  bottom: ${(props) => props.bottom};
  right: 20px;
  font-size: 24px;
  background-color: white;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;
