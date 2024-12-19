import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { axiosInstance } from "../utils/axiosInstance";

export default function NavBar() {
  const { me, setMe, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await axiosInstance.patch("/users/logout");
      setMe(null);
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("sessionId");
    }
  };

  if (isLoading) return null;

  return (
    <>
      <Link to="/">
        <span>갤러리</span>
      </Link>
      {me ? (
        <span
          onClick={logoutHandler}
          style={{ float: "right", cursor: "pointer" }}
        >
          로그아웃
        </span>
      ) : (
        <>
          <Link to="/signup">
            <span style={{ float: "right" }}>회원가입</span>
          </Link>
          <Link to="/login">
            <span style={{ float: "right", marginRight: 15 }}>로그인</span>
          </Link>
        </>
      )}
    </>
  );
}
