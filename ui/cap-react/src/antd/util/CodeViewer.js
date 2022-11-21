import React, { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { json } from "@codemirror/lang-json";

const CodeViewer = ({
  value,
  lang = json,
  isReadOnly = true,
  extraExtensions = [],
  height,
  schema,
}) => {
  const element = useRef(null);

  useEffect(() => {
    element.current.innerHTML = "";
    new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          lang(),
          EditorState.readOnly.of(isReadOnly),
          EditorView.theme({
            "&": {
              width: "100%",
              height: "100%",
            },
          }),
          extraExtensions,
        ],
      }),
      parent: element.current,
    });
  }, [value, schema]);

  return <div style={{ height: height }} ref={element} />;
};

export default CodeViewer;
