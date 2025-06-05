import PresentationHeader from '../layout/PresentationHeader';

const ImageSlide = ({ chapter, subchapter, title, url, isImageFullScreen, toggleImageFullScreen }) => {
  if (isImageFullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <button
          onClick={toggleImageFullScreen}
          className="absolute top-4 right-4 bg-gray-800 text-white p-2 rounded-full"
        >
          X
        </button>
        <img
          src={url}
          alt={title}
          title={title}
          className="max-w-full max-h-screen px-8"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <PresentationHeader chapter={chapter} subchapter={subchapter} />

      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center max-w-4xl">
          <img
            src={url}
            alt={title}
            title={title}
            className="size-fit w-auto mx-auto"
          />
          <p className="mt-2 text-lg font-medium">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageSlide; 