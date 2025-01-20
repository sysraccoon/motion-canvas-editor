# Motion Canvas Editor

[Motion Canvas](https://motioncanvas.io/) library that makes it easier to create complex code animations interactively.

> [!WARNING]  
> This project is experimental and provided as is without warranty of any kind. It may be significantly changed at any time.

## Installation

Run `npm install --save @sysraccoon/motion-canvas-editor`

## Usage

### Standalone

> [!NOTE]
> More complete solution can be found here: [motion-canvas-editor-demo](https://github.com/sysraccoon/motion-canvas-editor-demo)

This library provide `Editor` component. It can be created like this:
```tsx
// imports ...
import { Editor } from '@sysraccoon/motion-canvas-editor';

export default makeScene2D(function*(view) {
  const editor = createRef<Editor>();
  view.add(
    <Editor
      ref={editor}
      viewportProps={{
        maxWidth: 1440,
        maxHeight: 870,
      }}
      fontFamily={'Source Code Pro'}
      fontSize={30}
    />
  );
});
```

Now you can create `EditSnapshot` object that represent editor state:
```tsx
const pyHighlighter = new LezerHighlighter(pyParser);
const snapshot: EditSnapshot = {
  name: "main.py",
  code: Code.createSignal('print("hello world")'),
  highlighter: pyHighlighter,
  selection: DEFAULT,
  scroll: 0,
};
```

And pass it as initial parameter:
```tsx
<Editor
  ref={editor}
  editSnapshot={snapshot}
  // ...
/>
```

Or animate state change by using `tweenEditSnapshot` generator:
```tsx
yield* editor().tweenEditSnapshot(snapshot, 0.5);
```

### With NeoVim Plugin

This library provide built-in integration with [motion-canvas-editor.nvim](https://github.com/sysraccoon/motion-canvas-editor.nvim).

https://github.com/user-attachments/assets/f9d38663-1c7c-4547-a0cb-d237fc9da8f7

- Create editor object like present in **standalone** section.
- Create symbolic link to session file (or just copy it to project):

```sh
ln -s ~/projects/demo-project/mce-session.json ~/projects/my-animation/mce-session.json
# or
cp ~/projects/demo-project/mce-session.json ~/projects/my-animation/mce-session.json
```

- Import session file in your scene:
```tsx
import editorSession from '../../mce-session.json';
```

- Import `NeoVimSession` interface and `parseNeoVimSession` function:
```tsx
import { Editor, NeoVimSession, parseNeoVimSession } from '@sysraccoon/motion-canvas-editor';
```

- Parse snapshots:
```tsx
const snapshots = parseNeoVimSession(
  editorSession as NeoVimSession,
  (_name, _content) => Code.defaultHighlighter, // provide here your highlighter
);
```

- Use snapshots like present in **standalone** section.
