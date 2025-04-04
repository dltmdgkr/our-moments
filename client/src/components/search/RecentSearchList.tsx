interface Props {
  items: string[];
}

export default function RecentSearchList({ items }: Props) {
  return (
    <>
      <h4>최근 검색어</h4>
      {items.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </>
  );
}
