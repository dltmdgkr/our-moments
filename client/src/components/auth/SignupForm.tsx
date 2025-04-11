import styled from "styled-components";
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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <Label>이름</Label>
        <Input {...register("name", { required: "이름을 입력해 주세요." })} />
        <Error>{errors.name?.message as string}</Error>
      </Field>

      <Field>
        <Label>닉네임</Label>
        <Input
          {...register("username", {
            required: "닉네임을 입력해 주세요.",
            minLength: {
              value: 3,
              message: "닉네임을 3자 이상으로 해주세요.",
            },
          })}
        />
        <Error>{errors.username?.message as string}</Error>
      </Field>

      <Field>
        <Label>비밀번호</Label>
        <Input
          type="password"
          {...register("password", {
            required: "비밀번호를 입력해 주세요.",
            minLength: {
              value: 6,
              message: "비밀번호를 6자 이상으로 해주세요.",
            },
          })}
        />
        <Error>{errors.password?.message as string}</Error>
      </Field>

      <Field>
        <Label>비밀번호 확인</Label>
        <Input
          type="password"
          {...register("passwordConfirm", {
            required: "비밀번호를 다시 한번 입력해 주세요.",
          })}
        />
        <Error>{errors.passwordConfirm?.message as string}</Error>
      </Field>

      <SubmitButton type="submit">회원가입</SubmitButton>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
  max-width: 400px;
  margin: 0 auto;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
`;

const Input = styled.input`
  padding: 12px 16px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fafafa;
  outline: none;
  transition: border 0.2s ease;

  &:focus {
    border-color: #81c784;
    background-color: #fff;
  }
`;

const Error = styled.span`
  font-size: 12px;
  color: #e57373;
  margin-top: 4px;
`;

const SubmitButton = styled.button`
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  background: #ffa500;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #ff8c00;
  }
`;
