import { HiOutlineLocationMarker } from "react-icons/hi";
import styled from "styled-components";
import { Post } from "../../types/Post";

type LocationInfoProps = Pick<Post, "location">;

export default function LocationInfo({ location }: LocationInfoProps) {
  return (
    <LocationWrapper>
      <HiOutlineLocationMarker />
      <LocationText>{location}</LocationText>
    </LocationWrapper>
  );
}

const LocationWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  color: #6c757d;
  gap: 4px;
`;

const LocationText = styled.span`
  display: inline-block;
`;
