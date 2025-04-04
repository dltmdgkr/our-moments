import styled from "styled-components";
import { Place } from "../../types/Place";

interface Props {
  suggestions: Place[];
  onSelect: (place: Place) => void;
}

export default function SuggestionList({ suggestions, onSelect }: Props) {
  return (
    <>
      {suggestions.map((item, index) => (
        <StyledListItem key={item.id} onClick={() => onSelect(item)}>
          <div>
            <ItemTitle>{`${index + 1}. ${item.title}`}</ItemTitle>
            <ItemAddress>{item.address}</ItemAddress>
          </div>
          <ActionText>지도 이동</ActionText>
        </StyledListItem>
      ))}
    </>
  );
}

const StyledListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.15s ease-in;

  &:hover {
    background-color: #f0f4ff;
  }
`;

const ItemTitle = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const ItemAddress = styled.p`
  font-size: 14px;
  color: #777;
  margin: 4px 0 0;
`;

const ActionText = styled.span`
  font-size: 14px;
  color: #007bff;
  font-weight: 500;
`;
