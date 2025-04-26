import HamburgerButton from "../components/common/HamburgerButton";
import LoginContainer from "../components/auth/LoginContainer";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <>
      <HamburgerButton position={"sticky"} />
      <Heading>로그인</Heading>
      <LoginContainer />
      <SignupGuide>
        계정이 없으신가요?{" "}
        <Link to="/signup">
          <SignupLink>회원가입하기</SignupLink>
        </Link>
      </SignupGuide>
    </>
  );
}

const Heading = styled.h2`
  text-align: center;
  margin: 48px 0;
`;

const SignupGuide = styled.p`
  text-align: center;
  margin-top: 24px;
  font-size: 0.95rem;
  color: #666;
`;

const SignupLink = styled.span`
  color: #0070f3;
  font-weight: 500;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #0056c1;
  }
`;
