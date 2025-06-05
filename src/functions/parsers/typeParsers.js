const TAB_SIZE = 4;

const processDecoratedText = (text) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a style="color: blue" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    return text;
}

export const titleParser = () => ({
    name: 'title',
    test: (line) => line.startsWith('# '),
    parse: (line, context) => {
        context.slides.push({
            type: 'title',
            title: line.substring(2).trim()
        });
        return 0;
    }
});

export const chapterParser = () => ({
    name: 'chapter',
    test: (line) => line.startsWith('## '),
    parse: (line, context) => {
        context.addItemsSlide();
        context.currentChapter = line.substring(3).trim();
        context.currentSubchapter = null;
        context.slides.push({
            type: 'chapter',
            title: context.currentChapter
        });
        return 0;
    }
});

export const subchapterParser = () => ({
    name: 'subchapter',
    test: (line) => line.startsWith('### '),
    parse: (line, context) => {
        context.addItemsSlide();
        context.currentSubchapter = line.substring(4).trim();
        context.slides.push({
            type: 'subchapter',
            chapter: context.currentChapter,
            title: context.currentSubchapter
        });
        return 0;
    }
});

export const listItemParser = () => ({
    name: 'list-item',
    test: (line) => line.trim().startsWith('-'),
    parse: (line, context) => {
        const spaces = line.split('-')[0];
        const level = spaces.includes(" ") ? spaces.length / TAB_SIZE : 0;

        const currentItem = {
            type: 'text',
            content: processDecoratedText(line.substring(2).trim()),
            children: []
        };

        if (level === 0) {
            context.currentItems.push(currentItem);
        } else {
            const parent = context.extractParentItem(level);
            parent.children.push(currentItem);
        }
        return 0;
    }
});

export const imageParser = () => ({
    name: 'image',
    test: (line) => line.includes('![') && line.includes('](') && line.includes(')'),
    parse: (line, context) => {
        context.addItemsSlide();

        const regex = /!\[(.*?)\]\((.*?)\)/;
        const match = line.match(regex);

        if (match && match.length >= 3) {
            const title = processDecoratedText(match[1]);
            const url = match[2];

            context.slides.push({
                type: 'image',
                chapter: context.currentChapter,
                subchapter: context.currentSubchapter,
                title: title,
                url: url
            });
        }
        return 0;
    }
});

export const codeBlockParser = () => ({
    name: 'code-block',
    test: (line) => line.startsWith("```"),
    parse: (line, context, idx, lines) => {
        context.addItemsSlide();

        const codeBlock = [line];
        let lineIdx = idx;

        do {
            line = lines[++lineIdx];
            codeBlock.push(line);
        } while (!line.startsWith("```"))

        const header = codeBlock.shift().substring(3);
        const title = codeBlock[0].startsWith("title:") ? codeBlock.shift().substring(6) : '';

        codeBlock.pop();

        context.slides.push({
            type: 'code',
            chapter: context.currentChapter,
            subchapter: context.currentSubchapter,
            header: header,
            title: title,
            items: [...codeBlock],
        });

        return lineIdx - idx;
    }
}); 