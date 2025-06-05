import { useRef } from "react";

const UploadPanel = ({ handleFileUpload, setMdUrl, downloadMarkdown, CORS_DUMPER_URL }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-xl mb-2">to start the presentation</p>
      <button className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
        onClick={() => fileInputRef.current.click()}>upload a markdown file</button>
      <input
        type="file"
        accept=".md"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {CORS_DUMPER_URL && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-l mt-16">or paste a link to a valid markdown file: </p>
          <input
            type="text"
            onChange={(e) => setMdUrl(e.target.value)}
            className="border border-gray-300 focus:outline-none bg-gray-50 cursor-pointer"
          />
          <button
            className="mt-2 bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
            onClick={downloadMarkdown}
          >
            download markdown
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPanel; 