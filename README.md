# read.md

An app that transforms your boring markdown files into clean & simple presentations

The app currently supports rendering of:
- presentation titles
- chapters
- subchapters
- lists of any depth
- images
- code blocks

Check the [example.md file](./example.md) to learn how to organize your source file

You can use it [right away](https://read.devclub1.online)

To test the application locally you just have to:
```bash
cd read.md
npm install
npm run dev
```

Obtaining a proper production-ready build is as easy as:
```bash
npm run build
```

An optional feature to download the content of a markdown file directly from the web is available only if a cors-dumper server is available too

To enable this feature, create a .env file in the root directory and populate it as:
```
VITE_CORS_DUMPER_URL=http://your-cors-dumper?url=
```

I published cors-dumper implementation [here](https://codeberg.org/axbg/cors-dumper)

