# YasinCode 0.1.0

YasinCode is an experimental bilingual programming language. This first version can create a simple static web page using a handful of easy English or Arabic commands.

## Requirements

- Node.js LTS
- Visual Studio Code (recommended)

## Start the browser playground

Open this folder in VS Code, open Terminal > New Terminal, then run:

```bash
npm run preview
```

Open the local address printed in the terminal (normally http://127.0.0.1:4173). Keep the terminal open while using the playground.

## Build a website from a YasinCode file

```bash
npm run build:example
```

The generated website will be saved to `dist/index.html`. Open that file in your browser.

To build a different file, run:

```bash
node src/cli.js examples/arabic.yasin
```

## Run the tests

```bash
npm test
```

## Language commands in version 0.1.0

| English | Arabic | Purpose |
|---|---|---|
| `site "My site"` | `موقع "موقعي"` | Name the website |
| `heading "Welcome"` | `عنوان "أهلاً بك"` | Add a heading |
| `text "Hello"` | `نص "مرحباً"` | Add a paragraph |
| `button "Start"` | `زر "ابدأ"` | Add a button |
| `background "#eef3ff"` | `خلفية "#eef3ff"` | Set the page background |
| `run` | `تشغيل` | Mark the end of the program (optional) |

Lines beginning with `#` or `//` are comments.

## Current limitation

This is the first learning prototype. The button is visual only, and the language does not yet create databases, full applications, or AI features. Those will be added in later stages after the core language is tested.
