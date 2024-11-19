import { useState, FormEventHandler, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setMe } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      const result = await axiosInstance.post("/users/login", {
        username,
        password,
      });
      setMe({
        sessionId: result.data.sessionId,
        userId: result.data.userId,
        name: result.data.name,
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2>로그인</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>닉네임</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </>
  );
}
