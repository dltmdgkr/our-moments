import { ChangeEvent, forwardRef } from "react";
import styled from "styled-components";

interface Props {
  keyword: string;
  setKeyword: (val: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ keyword, setKeyword }, ref) => {
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setKeyword(e.target.value);
    };

    return (
      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          return;
        }}
      >
        <StyledInput
          ref={ref}
          value={keyword}
          onChange={handleInputChange}
          placeholder="장소를 검색하세요..."
        />
      </StyledForm>
    );
  }
);

export default SearchInput;

const StyledForm = styled.form`
  display: flex;
  position: sticky;
  top: 0;
  background-color: transparent;
  padding: 0;
  z-index: 10;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.1);

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;
