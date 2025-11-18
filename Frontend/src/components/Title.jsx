import './Title.css';
function Title({ text1, text2 }) {
  return (
    <>
      <div className="title-container flex gap-05">
        <h2 className="flex">
          {text1} <span>{text2}</span>
        </h2>
        <p className="line"></p>
      </div>
    </>
  );
}

export default Title;
