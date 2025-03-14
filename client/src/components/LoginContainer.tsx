import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { SubmitHandler, useForm } from "react-hook-form";
import { axiosInstance } from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import LoginForm from "./LoginForm";

export interface LoginFormValues {
  username: string;
  password: string;
}

export default function LoginContainer() {
  const { setMe } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>();

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
    <LoginForm
      register={register}
      errors={errors}
      clearErrors={clearErrors}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    />
  );
}
