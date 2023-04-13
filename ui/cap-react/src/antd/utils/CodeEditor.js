import { EditorView, keymap } from "@codemirror/view";
import { linter, lintGutter } from "@codemirror/lint";
import { indentWithTab } from "@codemirror/commands";
import CodeViewer from "./CodeViewer";

const CodeEditor = ({
  value,
  lang,
  lint,
  isReadOnly,
  handleEdit,
  schema,
  height,
}) => {
  const extraExtensions = [
    keymap.of([indentWithTab]),
    linter(lint()),
    lintGutter(),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        handleEdit(update.state.doc.toString());
      }
    }),
  ];

  return (
    <CodeViewer
      value={value}
      lang={lang}
      isReadOnly={isReadOnly}
      extraExtensions={extraExtensions}
      schema={schema}
      height={height}
    />
  );
};

export default CodeEditor;
