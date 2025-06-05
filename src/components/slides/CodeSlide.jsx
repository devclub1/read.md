import SyntaxHighlighter from 'react-syntax-highlighter';
import codeStyle from 'react-syntax-highlighter/src/styles/hljs/docco.js';
import PanelHeader from '../layout/PanelHeader';

const CodeSlide = ({ chapter, subchapter, header, title, items }) => {
  return (
    <div className="relative h-full">
      <PanelHeader chapter={chapter} subchapter={subchapter} />

      <div className="flex flex-col items-center justify-center h-full">
        <SyntaxHighlighter
          language={header ? header : 'js'}
          style={codeStyle}
        >
          {items.join("\n")}
        </SyntaxHighlighter>
        {title && <p>{title}</p>}
      </div>
    </div>
  );
};

export default CodeSlide; 