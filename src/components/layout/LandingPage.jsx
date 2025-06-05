const LandingPage = ({ handleFileUpload, setMdUrl, downloadMarkdown, CORS_DUMPER_URL }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-xl mb-8">to start the presentation</p>
      <p className="text-l">upload a markdown file: </p>
      <input
        type="file"
        accept=".md"
        onChange={handleFileUpload}
        className="border border-gray-300 rounded-md focus:outline-none bg-gray-50 cursor-pointer"
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
            className="mt-2 bg-gray-800 text-white p-2 rounded-full"
            onClick={downloadMarkdown}
          >
            Download markdown
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 