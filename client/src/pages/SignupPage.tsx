import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { SubmitHandler, useForm } from "react-hook-form";

export default function SignupPage() {
  const { setMe } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>();

  interface SignupFormValues {
    name: string;
    username: string;
    password: string;
    passwordConfirm: string;
  }

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    if (data.password !== data.passwordConfirm) {
      setError(
        "passwordConfirm",
        { message: "비밀번호가 일치하지 않습니다." },
        { shouldFocus: true }
      );
      return;
    }

    try {
      const result = await axiosInstance.post("/users/signup", {
        name: data.name,
        username: data.username,
        password: data.password,
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>이름</label>
          <input {...register("name", { required: "이름을 입력해 주세요." })} />
          <span>{errors.name?.message as string}</span>
        </div>
        <div>
          <label>닉네임</label>
          <input
            {...register("username", {
              required: "닉네임을 입력해 주세요.",
              minLength: {
                value: 3,
                message: "닉네임을 3자 이상으로 해주세요.",
              },
            })}
          />
          <span>{errors.username?.message as string}</span>
        </div>
        <div>
          <label>비밀번호</label>
          <input
            type="password"
            {...register("password", {
              required: "비밀번호를 입력해 주세요.",
              minLength: {
                value: 6,
                message: "비밀번호를 6자 이상으로 해주세요.",
              },
            })}
          />
          <span>{errors.password?.message as string}</span>
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            {...register("passwordConfirm", {
              required: "비밀번호를 다시 한번 입력해 주세요.",
            })}
          />
          <span>{errors.passwordConfirm?.message as string}</span>
        </div>
        <button type="submit">회원가입</button>
      </form>
    </>
  );
}
