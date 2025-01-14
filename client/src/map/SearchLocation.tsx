import "./SearchLocation.css";

export default function SearchLocation() {
  return (
    <div>
      <form>
        <input value={""} />
      </form>
      <ul>
        {Array.from({ length: 10 }).map((item, index) => {
          return (
            <li key={index}>
              <label>지역</label>
              <span>서울 강남구 신사동 668-33</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
