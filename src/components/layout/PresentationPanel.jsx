import TitleSlide from '../slides/TitleSlide';
import ChapterSlide from '../slides/ChapterSlide';
import SubchapterSlide from '../slides/SubchapterSlide';
import ImageSlide from '../slides/ImageSlide';
import CodeSlide from '../slides/CodeSlide';
import ItemsSlide from '../slides/ItemsSlide';

const PresentationPanel = ({
  slides,
  currentSlideIndex,
  currentItemIndex,
  isImageFullScreen,
  toggleImageFullScreen,
  handleReset,
}) => {
  if (slides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-xl mb-8">The uploaded markdown is empty</p>
        <button
          onClick={handleReset}
          className="bg-blue-600 text-white px-4 py-1 rounded cursor-pointer"
        >
          Reset
        </button>
      </div>
    );
  }

  const slide = slides[currentSlideIndex];

  switch (slide.type) {
    case 'title':
      return <TitleSlide title={slide.title} />;
    case 'chapter':
      return <ChapterSlide title={slide.title} />;
    case 'subchapter':
      return <SubchapterSlide chapter={slide.chapter} title={slide.title} />;
    case 'image':
      return (
        <ImageSlide
          chapter={slide.chapter}
          subchapter={slide.subchapter}
          title={slide.title}
          url={slide.url}
          isImageFullScreen={isImageFullScreen}
          toggleImageFullScreen={toggleImageFullScreen}
        />
      );
    case 'code':
      return (
        <CodeSlide
          chapter={slide.chapter}
          subchapter={slide.subchapter}
          header={slide.header}
          title={slide.title}
          items={slide.items}
        />
      );
    case 'items':
      return (
        <ItemsSlide
          chapter={slide.chapter}
          subchapter={slide.subchapter}
          items={slide.items}
          currentItemIndex={currentItemIndex}
        />
      );
    default:
      return null;
  }
};

export default PresentationPanel; 