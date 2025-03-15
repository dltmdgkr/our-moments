import HamburgerButton from "../components/common/HamburgerButton";
import LoginContainer from "../components/auth/LoginContainer";

export default function LoginPage({ showModal }: { showModal: () => void }) {
  return (
    <>
      <HamburgerButton showModal={showModal} position={"sticky"} />
      <h2>로그인</h2>
      <LoginContainer />
    </>
  );
}
