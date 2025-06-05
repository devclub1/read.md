const Footer = ({ fileUploaded, currentSlideIndex, slides, showImageFullScreenButton, isImageFullScreen, toggleImageFullScreen, toggleFullScreen, isFullScreen, handleReset }) => {
  return (
    <div className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {fileUploaded && slides.length > 0 ? (
          <>
            <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
            <div className="flex space-x-2">
              {showImageFullScreenButton && (
                <button
                  onClick={toggleImageFullScreen}
                  className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
                >
                  {isImageFullScreen ? 'Exit Image Fullscreen' : 'Image Fullscreen'}
                </button>
              )}
              <button
                onClick={toggleFullScreen}
                className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
              >
                {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
              <button
                onClick={handleReset}
                className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
              >
                Reset
              </button>
            </div>
          </>
        ) : (
          <div className="mx-auto text-center text-sm group">
            <div className="relative inline-block">
              <span className="transition-opacity duration-1000 group-hover:opacity-0">//</span>
              <div className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap cursor-default opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
                <a href="https://github.com/devclub1" target="_blank">developed // devclub1</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Footer; 