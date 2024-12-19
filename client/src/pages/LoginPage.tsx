import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { SubmitHandler, useForm } from "react-hook-form";
import { AxiosError } from "axios";

export default function LoginPage() {
  const { setMe } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>();

  interface LoginFormValues {
    username: string;
    password: string;
  }

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const result = await axiosInstance.patch("/users/login", {
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
      if (err instanceof AxiosError && err.response?.status === 400) {
        setError("root", { message: "입력하신 정보가 올바르지 않습니다." });
      } else {
        console.error(err);
      }
    }
  };

  return (
    <>
      <h2>로그인</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>닉네임</label>
          <input
            {...register("username", {
              required: "닉네임을 입력해 주세요.",
              onChange: () => clearErrors("root"),
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
              onChange: () => clearErrors("root"),
            })}
          />
          <span>{errors.password?.message as string}</span>
        </div>
        <button type="submit">로그인</button>
        <p>{errors.root?.message as string}</p>
      </form>
    </>
  );
}
