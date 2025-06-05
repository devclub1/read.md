export class MarkdownParserFactory {
  constructor() {
    this.elementParsers = [];
  }

  registerParser(parser) {
    this.elementParsers.push(parser);
  }

  getParsers() {
    return this.elementParsers;
  }

  getParserByName(name) {
    return this.elementParsers.find(parser => parser.name === name);
  }
} 