import TitleSlide from '../slides/TitleSlide';
import ChapterSlide from '../slides/ChapterSlide';
import SubchapterSlide from '../slides/SubchapterSlide';
import ImageSlide from '../slides/ImageSlide';
import CodeSlide from '../slides/CodeSlide';
import ItemsSlide from '../slides/ItemsSlide';
import LandingPage from './LandingPage';

const MainPanel = ({
  slides,
  currentSlideIndex,
  currentItemIndex,
  fileUploaded,
  isImageFullScreen,
  toggleImageFullScreen,
  handleFileUpload,
  setMdUrl,
  downloadMarkdown,
  CORS_DUMPER_URL,
  computeRecursiveContent
}) => {
  if (!fileUploaded) {
    return (
      <LandingPage
        handleFileUpload={handleFileUpload}
        setMdUrl={setMdUrl}
        downloadMarkdown={downloadMarkdown}
        CORS_DUMPER_URL={CORS_DUMPER_URL}
      />
    );
  }

  if (slides.length === 0) {
    return null;
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
          computeRecursiveContent={computeRecursiveContent}
        />
      );
    default:
      return null;
  }
};

export default MainPanel; 