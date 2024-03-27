import "./chat.css";
export default function CharCard({ data }) {
  return (
    <>
      <div>
        <span>{data.id}</span>
        <span>{data.timestamp}</span>
      </div>
      <p>{data.text}</p>
    </>
  );
}
