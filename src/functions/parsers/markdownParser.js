import { MarkdownParserFactory } from './parserFactory';
import {
    titleParser,
    chapterParser,
    subchapterParser,
    listItemParser,
    imageParser,
    codeBlockParser
} from './typeParsers';

const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};

const createDefaultParserFactory = () => {
    const factory = new MarkdownParserFactory();

    factory.registerParser(titleParser());
    factory.registerParser(chapterParser());
    factory.registerParser(subchapterParser());
    factory.registerParser(listItemParser());
    factory.registerParser(imageParser());
    factory.registerParser(codeBlockParser());

    return factory;
};

export const parseMarkdown = (markdown) => {
    const lines = markdown.split('\n');
    const slides = [];

    const context = {
        slides,
        currentChapter: null,
        currentSubchapter: null,
        currentItems: [],
        addItemsSlide: function () {
            if (this.currentItems.length > 0) {
                const maxPerPage = chunkArray(this.currentItems, 3);

                maxPerPage.forEach(slide => this.slides.push({
                    type: 'items',
                    chapter: this.currentChapter,
                    subchapter: this.currentSubchapter,
                    items: [...slide]
                }));

                this.currentItems = [];
            }
        },
        extractParentItem: function (level) {
            let currentParent = this.currentItems[this.currentItems.length - 1];

            for (let idx = 1; idx < level; idx++) {
                currentParent = currentParent.children[currentParent.children.length - 1];
            }

            return currentParent;
        }
    };

    const parserFactory = createDefaultParserFactory();
    const elementParsers = parserFactory.getParsers();

    for (let idx = 0; idx < lines.length; idx++) {
        let line = lines[idx];

        if (line.trim() === "") {
            continue;
        }

        let parserFound = false;
        for (const parser of elementParsers) {
            if (parser.test(line)) {
                idx += parser.parse(line, context, idx, lines);
                parserFound = true;
                break;
            }
        }

        if (!parserFound) {
            console.warn(`No parser found for line ${idx + 1}: ${line.substring(0, 40)}${line.length > 40 ? '...' : ''}`);
        }
    }

    context.addItemsSlide();

    return slides;
}; 