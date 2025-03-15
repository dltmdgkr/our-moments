import HamburgerButton from "../components/common/HamburgerButton";
import SignupContainer from "../components/auth/SignupContainer";

export default function SignupPage({ showModal }: { showModal: () => void }) {
  return (
    <>
      <HamburgerButton showModal={showModal} position={"sticky"} />
      <h2>회원가입</h2>
      <SignupContainer />
    </>
  );
}
