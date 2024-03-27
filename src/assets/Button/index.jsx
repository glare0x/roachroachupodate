export default function index({ text, styles, clickFunction = () => {} }) {
  return (
    <button style={styles} onClick={clickFunction}>
      {text}
    </button>
  );
}
