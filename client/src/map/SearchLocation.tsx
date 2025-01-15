import { FormEvent, useState } from "react";
import "./SearchLocation.css";

export default function SearchLocation() {
  const [keyword, setKeyword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
        />
      </form>
      <ul>
        {Array.from({ length: 30 }).map((item, index) => {
          return (
            <li key={index}>
              <span>지역</span>
              <span>서울 강남구 신사동 668-33</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
