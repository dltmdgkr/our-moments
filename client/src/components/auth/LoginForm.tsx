import {
  FieldErrors,
  SubmitHandler,
  UseFormClearErrors,
  UseFormRegister,
} from "react-hook-form";
import { LoginFormValues } from "./LoginContainer";
import styled from "styled-components";

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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <Label>닉네임</Label>
        <Input
          {...register("username", {
            required: "닉네임을 입력해 주세요.",
            onChange: () => clearErrors("root"),
          })}
        />
        <ErrorMsg>{errors.username?.message as string}</ErrorMsg>
      </InputGroup>
      <InputGroup>
        <Label>비밀번호</Label>
        <Input
          type="password"
          {...register("password", {
            required: "비밀번호를 입력해 주세요.",
            onChange: () => clearErrors("root"),
          })}
        />
        <ErrorMsg>{errors.password?.message as string}</ErrorMsg>
      </InputGroup>
      <SubmitButton type="submit">로그인</SubmitButton>
      <ErrorMsg>{errors.root?.message as string}</ErrorMsg>
    </Form>
  );
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0 auto;
  max-width: 400px;
  padding: 0 20px;
`;

const InputGroup = styled.div`
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
  padding: 10px 14px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;

  &:focus {
    outline: none;
    border-color: #ffa500;
    box-shadow: 0 0 0 2px rgba(255, 165, 0, 0.2);
  }
`;

const ErrorMsg = styled.span`
  font-size: 13px;
  color: #ef5350;
  margin-top: 6px;
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
