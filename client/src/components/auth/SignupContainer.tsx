import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { axiosInstance } from "../../utils/axiosInstance";
import SignupForm from "./SignupForm";

export interface SignupFormValues {
  name: string;
  username: string;
  password: string;
  passwordConfirm: string;
}

export default function SignupContainer() {
  const navigate = useNavigate();
  const { setMe } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignupFormValues>();

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
    <SignupForm
      register={register}
      errors={errors}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
    />
  );
}
