import { FieldErrors, SubmitHandler, UseFormRegister } from "react-hook-form";
import { SignupFormValues } from "./SignupContainer";

interface SignupFormProps {
  register: UseFormRegister<SignupFormValues>;
  errors: FieldErrors<SignupFormValues>;
  handleSubmit: (
    callback: SubmitHandler<SignupFormValues>
  ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
  onSubmit: SubmitHandler<SignupFormValues>;
}

export default function SignupForm({
  register,
  errors,
  handleSubmit,
  onSubmit,
}: SignupFormProps) {
  return (
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
  );
}
