import HamburgerButton from "../components/common/HamburgerButton";
import SignupContainer from "../components/auth/SignupContainer";
import styled from "styled-components";

export default function SignupPage({ showModal }: { showModal: () => void }) {
  return (
    <>
      <HamburgerButton showModal={showModal} position="sticky" />
      <Heading>회원가입</Heading>
      <SignupContainer />
    </>
  );
}

const Heading = styled.h2`
  text-align: center;
  margin: 48px 0;
`;
