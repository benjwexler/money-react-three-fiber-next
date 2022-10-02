import TextHighlight from "./TextHighlight";

export default function EndCredits(props) {
  return (
    <div className="falling-bills-text-container" {...props}>
      <h1 className="the-end">The End</h1>
      <h2 style={{ fontSize: 24 }} className="created-with">
        Created with React-Three-Fiber & React-Spring
      </h2>
      <h3 style={{ marginTop: 20 }}>
        <TextHighlight>
          <a
            href="https://github.com/benjwexler/money-react-three-fiber-next"
            target="_blank"
            rel="noreferrer"
          >
            Source Code
          </a>
        </TextHighlight>
      </h3>
    </div>
  );
}
