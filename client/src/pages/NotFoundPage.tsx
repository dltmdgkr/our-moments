import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiAlertCircle } from "react-icons/fi";

export default function NotFoundPage() {
  return (
    <Wrapper>
      <IconWrapper>
        <FiAlertCircle size={64} />
      </IconWrapper>
      <Title>404 - 페이지를 찾을 수 없어요</Title>
      <Description>
        존재하지 않거나 삭제된 페이지에 접근하셨어요.
        <br />
        주소를 다시 확인해 주세요!
      </Description>
      <HomeButton to="/">홈으로 돌아가기</HomeButton>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px;
  background-color: #f9f9f9;
  color: #333;
`;

const IconWrapper = styled.div`
  margin-bottom: 24px;
  color: #ff6b6b;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  text-align: center;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const HomeButton = styled(Link)`
  background-color: #0077ff;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005fcc;
  }
`;
