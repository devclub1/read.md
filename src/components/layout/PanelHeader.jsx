const PanelHeader = ({ chapter, subchapter }) => {
  return (
    <div className="absolute top-2 left-2">
      {chapter && (
        <h3 className="text-lg font-medium">{chapter}</h3>
      )}
      {subchapter && (
        <h4 className="text-md font-medium mt-1"> &gt; {subchapter}</h4>
      )}
    </div>
  );
}

export default PanelHeader;
