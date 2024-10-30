export default function UploadForm() {
  return (
    <form>
      <label htmlFor="image">사진</label>
      <input id="image" type="file" />
      <button type="submit">제출</button>
    </form>
  );
}
