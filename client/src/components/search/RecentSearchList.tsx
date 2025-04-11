import styled from "styled-components";
import { Place } from "../../types/Place";

interface Props {
  places: Place[];
  onClick: (place: Place) => void;
  onDelete: (place: Place) => void;
}

export default function RecentSearchList({ places, onClick, onDelete }: Props) {
  return (
    <Container>
      <Title>최근 검색어</Title>
      {places.length === 0 ? (
        <EmptyMessage>
          <span>📭</span> 최근 검색 내역이 없습니다.
        </EmptyMessage>
      ) : (
        <List>
          {places.map((place) => (
            <Item key={place.id}>
              <Text onClick={() => onClick(place)}>{place.title}</Text>
              <DeleteButton onClick={() => onDelete(place)}>✕</DeleteButton>
            </Item>
          ))}
        </List>
      )}
    </Container>
  );
}

const Container = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  max-width: 400px;
`;

const Title = styled.h4`
  margin: 4px 0 16px 8px;
  font-size: 16px;
  color: #333;
`;

const EmptyMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #888;
  font-size: 14px;
  padding: 12px 0 4px 8px;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  background-color: #f1f3f5;
  padding: 6px 10px 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e4e7;
  }
`;

const Text = styled.span`
  margin-right: 6px;
`;

const DeleteButton = styled.button`
  border: none;
  background: transparent;
  color: #888;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;
