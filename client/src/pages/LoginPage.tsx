import HamburgerButton from "../components/common/HamburgerButton";
import LoginContainer from "../components/auth/LoginContainer";
import styled from "styled-components";

export default function LoginPage({ showModal }: { showModal: () => void }) {
  return (
    <>
      <HamburgerButton showModal={showModal} position={"sticky"} />
      <Heading>로그인</Heading>
      <LoginContainer />
    </>
  );
}

const Heading = styled.h2`
  text-align: center;
  margin: 48px 0;
`;
