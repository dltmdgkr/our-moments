import {
  FieldErrors,
  SubmitHandler,
  UseFormClearErrors,
  UseFormRegister,
} from "react-hook-form";
import { LoginFormValues } from "./LoginContainer";

interface LoginFormProps {
  register: UseFormRegister<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  clearErrors: UseFormClearErrors<LoginFormValues>;
  handleSubmit: (
    callback: SubmitHandler<LoginFormValues>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: SubmitHandler<LoginFormValues>;
}

export default function LoginForm({
  register,
  errors,
  clearErrors,
  handleSubmit,
  onSubmit,
}: LoginFormProps) {
  return (
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
  );
}
