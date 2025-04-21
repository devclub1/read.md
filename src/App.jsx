import { useState, useEffect, useCallback } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import codeStyle from 'react-syntax-highlighter/src/styles/hljs/docco.js';
import PanelHeader from './components/panel/header/PanelHeader';

export default function App() {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);

  const parseMarkdown = (markdown) => {
    const lines = markdown.split('\n').filter(line => line.trim() !== '');
    const presentationSlides = [];

    let currentChapter = null;
    let currentSubchapter = null;
    let currentItems = [];

    const chunkArray = (array, size) => {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }

    const processText = (text) => {
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
      text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a style="color: blue" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

      return text;
    };

    const addItemsSlide = () => {
      if (currentItems.length > 0) {
        const maxPerPage = chunkArray(currentItems, 3);

        maxPerPage.forEach(slide => presentationSlides.push({
          type: 'items',
          chapter: currentChapter,
          subchapter: currentSubchapter,
          items: [...slide]
        }));

        currentItems = [];
      }
    };

    for (let idx = 0; idx < lines.length; idx++) {
      let line = lines[idx];

      if (line.startsWith('## ')) {
        addItemsSlide();

        currentChapter = line.substring(3).trim();
        currentSubchapter = null;
        presentationSlides.push({
          type: 'chapter',
          title: currentChapter
        });
      } else if (line.startsWith('### ')) {
        addItemsSlide();

        currentSubchapter = line.substring(4).trim();
        presentationSlides.push({
          type: 'subchapter',
          chapter: currentChapter,
          title: currentSubchapter
        });
      } else if (line.startsWith('- ')) {
        const processedText = processText(line.substring(2).trim());
        currentItems.push({
          type: 'text',
          content: processedText
        });
      } else if (line.includes('![') && line.includes('](') && line.includes(')')) {
        addItemsSlide();

        const regex = /!\[(.*?)\]\((.*?)\)/;
        const match = line.match(regex);

        if (match && match.length >= 3) {
          const title = processText(match[1]);
          const url = match[2];

          presentationSlides.push({
            type: 'image',
            chapter: currentChapter,
            subchapter: currentSubchapter,
            title: title,
            url: url
          });
        }
      } else if (line.startsWith("```")) {
        addItemsSlide();

        const codeBlock = [line];

        do {
          line = lines[++idx];
          codeBlock.push(line);
        } while (!line.startsWith("```"))

        codeBlock.pop();

        presentationSlides.push({
          type: 'code',
          chapter: currentChapter,
          subchapter: currentSubchapter,
          header: codeBlock.shift().substring(3),
          items: [...codeBlock],
        });
      }
    }

    addItemsSlide();

    return presentationSlides;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const parsedSlides = parseMarkdown(content);
        setSlides(parsedSlides);
        setCurrentSlideIndex(0);
        setCurrentItemIndex(0);
        setFileUploaded(true);
      };
      reader.readAsText(file);
    }
  };

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

  const renderCurrentSlide = () => {
    if (slides.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <p className="text-xl mb-8">Please upload a markdown file to start the presentation</p>
          <input
            type="file"
            accept=".md"
            onChange={handleFileUpload}
            className="border border-gray-300 rounded-md focus:outline-none bg-gray-50 cursor-pointer" />
        </div>
      );
    }

    const slide = slides[currentSlideIndex];

    if (slide.type === 'chapter') {
      return (
        <div className="flex items-center justify-center h-full text-center">
          <h1 className="text-4xl font-bold">{slide.title}</h1>
        </div>
      );
    } else if (slide.type === 'subchapter') {
      return (
        <div className="relative h-full">
          <PanelHeader chapter={slide.chapter} />

          <div className="flex items-center justify-center h-full text-center">
            <h2 className="text-3xl font-bold">{slide.title}</h2>
          </div>
        </div>
      );
    } else if (slide.type === 'image') {
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
              src={slide.url}
              alt={slide.title}
              title={slide.title}
              className="max-w-full max-h-screen px-8"
            />
          </div>
        );
      }

      return (
        <div className="relative h-full">
          <PanelHeader chapter={slide.chapter} subchapter={slide.subchapter} />

          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center max-w-4xl">
              <img
                src={slide.url}
                alt={slide.title}
                title={slide.title}
                className="size-fit w-auto mx-auto"
              />
              <p
                className="mt-2 text-lg font-medium"
              >
                {slide.title}
              </p>
            </div>
          </div>
        </div>
      );
    } else if (slide.type === 'code') {
      return (
        <div className="relative h-full">
          <PanelHeader chapter={slide.chapter} subchapter={slide.subchapter} />

          <div className="flex flex-col items-center justify-center h-full">
            <SyntaxHighlighter
              language={slide.header ? slide.header : 'js'}
              style={codeStyle}
            >
              {slide.items.join("\n")}
            </SyntaxHighlighter>
          </div>
        </div>
      )
    } else if (slide.type === 'items') {
      return (
        <div className="relative h-full">
          <PanelHeader chapter={slide.chapter} subchapter={slide.subchapter} />

          <div className="flex flex-col items-center justify-center h-full">
            <div className="space-y-8 text-xl max-w-2xl">
              {slide.items.map((item, index) => {
                const isVisible = index <= currentItemIndex;
                const itemPosition = slide.items.length > 2 ? 'mt-12' : '';

                return (
                  <div
                    key={index}
                    className={`text-center transition-opacity ${isVisible ? 'duration-500 opacity-100' : 'duration-0 opacity-0'} ${itemPosition}`}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    return null;
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

  const handleReset = () => {
    setFileUploaded(false);
    setSlides([]);
    setCurrentSlideIndex(0);
    setCurrentItemIndex(0);
    setIsFullScreen(false);
    setIsImageFullScreen(false);
  };

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
      {!fileUploaded && (
        <div className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Markdown Presentation App</h1>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        <div className="relative h-full">
          {renderCurrentSlide()}
        </div>
      </div>

      <div className="bg-gray-200 p-4">
        <div className="container mx-auto flex justify-between items-center">
          {fileUploaded ? (
            <>
              <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
              <div className="flex space-x-2">
                {showImageFullScreenButton && (
                  <button
                    onClick={toggleImageFullScreen}
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                  >
                    {isImageFullScreen ? 'Exit Image Fullscreen' : 'Image Fullscreen'}
                  </button>
                )}
                <button
                  onClick={toggleFullScreen}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  {isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Reset
                </button>
              </div>
            </>
          ) : (
            <span className="text-center w-full">Upload a markdown file to begin</span>
          )}
        </div>
      </div>
    </div>
  );
}
