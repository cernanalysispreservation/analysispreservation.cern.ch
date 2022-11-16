import React, { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { indentWithTab } from "@codemirror/commands";
import { linter, lintGutter } from "@codemirror/lint";

const CodeEditor = ({ value, isReadOnly, handleEdit, schema }) => {
  const element = useRef(null);

  useEffect(
    () => {
      element.current.innerHTML = "";
      new EditorView({
        state: EditorState.create({
          doc: value,
          extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            json(),
            linter(jsonParseLinter()),
            lintGutter(),
            EditorState.readOnly.of(isReadOnly),
            EditorView.updateListener.of(update => {
              if (update.docChanged) {
                handleEdit(update.state.doc.toString());
              }
            }),
          ],
        }),
        parent: element.current,
      });
    },
    [value, schema]
  );

  return <div ref={element} />;
};

export default CodeEditor;
