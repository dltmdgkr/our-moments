import axios from "axios";
import { FormEventHandler, useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const { me, setMe } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      const result = await axios.post("/users/signup", {
        name,
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
      <h2>회원가입</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>닉네임</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </>
  );
}
