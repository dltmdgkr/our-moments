import styled, { keyframes } from "styled-components";

export default function SkeletonRecentSearchList() {
  return (
    <Container>
      <Title>최근 검색어</Title>
      <List>
        {Array.from({ length: 5 }).map((_, i) => (
          <Item key={i}>
            <Text />
            <DeleteButton />
          </Item>
        ))}
      </List>
    </Container>
  );
}

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonBlock = styled.div`
  background: #f0f0f0;
  background-image: linear-gradient(
    90deg,
    #f0f0f0 0px,
    #e0e0e0 40px,
    #f0f0f0 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s infinite;
`;

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
  color: #999;
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
  width: fit-content;
`;

const Text = styled(SkeletonBlock)`
  width: 60px;
  height: 14px;
  border-radius: 7px;
  margin-right: 6px;
`;

const DeleteButton = styled(SkeletonBlock)`
  width: 12px;
  height: 12px;
  border-radius: 50%;
`;
