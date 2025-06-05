const TAB_SIZE = 4;

export const parseMarkdown = (markdown) => {
  const lines = markdown.split('\n');
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

  const extractParentItem = (currentItems, level) => {
    let currentParent = currentItems[currentItems.length - 1];

    for (let idx = 1; idx < level; idx++) {
      currentParent = currentParent.children[currentParent.children.length - 1];
    }

    return currentParent;
  }

  for (let idx = 0; idx < lines.length; idx++) {
    let line = lines[idx];

    if (line.trim() === "") {
      continue;
    }

    if (line.startsWith('# ')) {
      presentationSlides.push({
        type: 'title',
        title: line.substring(2).trim()
      });
    } else if (line.startsWith('## ')) {
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

    } else if (line.trim().startsWith('-')) {
      const spaces = line.split('-')[0];
      const level = spaces.includes(" ") ? spaces.length / TAB_SIZE : 0;

      const currentItem = {
        type: 'text',
        content: processText(line.substring(2).trim()),
        children: []
      };

      if (level === 0) {
        currentItems.push(currentItem);
      } else {
        const parent = extractParentItem(currentItems, level);
        parent.children.push(currentItem);
      }
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


      const header = codeBlock.shift().substring(3);
      const title = codeBlock[0].startsWith("title:") ? codeBlock.shift().substring(6) : '';

      codeBlock.pop();

      presentationSlides.push({
        type: 'code',
        chapter: currentChapter,
        subchapter: currentSubchapter,
        header: header,
        title: title,
        items: [...codeBlock],
      });
    }
  }

  addItemsSlide();

  return presentationSlides;
}; 