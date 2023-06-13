import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";

const CodeViewer = ({
  value,
  lang,
  isReadOnly = true,
  extraExtensions = [],
  height,
  schema,
}) => {
  const element = useRef(null);

  useEffect(() => {
    element.current.innerHTML = "";

    let extensions = [
      basicSetup,
      EditorState.readOnly.of(isReadOnly),
      EditorView.theme({
        "&": {
          width: "100%",
          height: "100%",
        },
      }),
    ];
    if (lang) {
      extensions.push(lang());
    }

    new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [...extensions, ...extraExtensions],
      }),
      parent: element.current,
    });
  }, [value, schema]);

  return <div style={{ height: height }} ref={element} />;
};

export default CodeViewer;
