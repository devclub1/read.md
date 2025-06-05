import { useState, useEffect, useCallback } from 'react';
import { parseMarkdown } from './functions/markdownParser';
import { computeRecursiveContent } from './functions/contentRenderer';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MainPanel from './components/layout/MainPanel';

export default function App() {
  const CORS_DUMPER_URL = import.meta.env.VITE_CORS_DUMPER_URL;

  const [slides, setSlides] = useState([]);
  const [mdUrl, setMdUrl] = useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);

  const initializePresentation = (content) => {
    const parsedSlides = parseMarkdown(content);
    setSlides(parsedSlides);
    setCurrentSlideIndex(0);
    setCurrentItemIndex(0);
    setFileUploaded(true);
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        initializePresentation(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const downloadMarkdown = () => {
    if (!mdUrl.startsWith("http") || !mdUrl.endsWith(".md")) {
      alert("Invalid URL");
    }

    fetch(CORS_DUMPER_URL + mdUrl)
      .then(response => response.json())
      .then(body => initializePresentation(body.data))
  }

  const handleNext = useCallback(() => {
    const currentSlide = slides[currentSlideIndex];

    if (currentSlide && currentSlide.type === 'items' && currentItemIndex < currentSlide.items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
    } else {
      if (currentSlideIndex < slides.length - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
        setCurrentItemIndex(0);
      }
    }
  }, [slides, currentItemIndex, currentSlideIndex]);

  const handlePrevious = useCallback(() => {
    const currentSlide = slides[currentSlideIndex];

    if (currentSlide && currentSlide.type === 'items' && currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
    } else {
      if (currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);

        const previousSlide = slides[currentSlideIndex - 1];

        if (previousSlide && previousSlide.type === 'items') {
          setCurrentItemIndex(previousSlide.items.length - 1);
        } else {
          setCurrentItemIndex(0);
        }
      }
    }
  }, [slides, currentItemIndex, currentSlideIndex]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const toggleImageFullScreen = () => {
    setIsImageFullScreen(!isImageFullScreen);
  };

  const handleReset = () => {
    setFileUploaded(false);
    setSlides([]);
    setCurrentSlideIndex(0);
    setCurrentItemIndex(0);
    setIsFullScreen(false);
    setIsImageFullScreen(false);
  };

  const handleNavigationKeys = useCallback((e) => {
    if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "Escape") {
      if (isImageFullScreen) {
        setIsImageFullScreen(false);
      }
    }
  }, [isImageFullScreen, handleNext, handlePrevious]);

  useEffect(() => {
    window.addEventListener("keydown", handleNavigationKeys);

    return () => {
      window.removeEventListener("keydown", handleNavigationKeys);
    }
  }, [slides, currentSlideIndex, currentItemIndex, handleNavigationKeys]);

  const currentSlide = slides[currentSlideIndex] || {};
  const showImageFullScreenButton = fileUploaded && currentSlide.type === 'image';

  return (
    <div className="flex flex-col h-screen bg-white">
      {!fileUploaded && <Header />}

      <div className="flex-1 overflow-hidden relative">
        <div className="relative h-full">
          <MainPanel 
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            currentItemIndex={currentItemIndex}
            fileUploaded={fileUploaded}
            isImageFullScreen={isImageFullScreen}
            toggleImageFullScreen={toggleImageFullScreen}
            handleFileUpload={handleFileUpload}
            setMdUrl={setMdUrl}
            downloadMarkdown={downloadMarkdown}
            CORS_DUMPER_URL={CORS_DUMPER_URL}
            computeRecursiveContent={computeRecursiveContent}
          />
        </div>
      </div>

      <Footer 
        fileUploaded={fileUploaded}
        currentSlideIndex={currentSlideIndex}
        slides={slides}
        showImageFullScreenButton={showImageFullScreenButton}
        isImageFullScreen={isImageFullScreen}
        toggleImageFullScreen={toggleImageFullScreen}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        handleReset={handleReset}
      />
    </div>
  );
}
