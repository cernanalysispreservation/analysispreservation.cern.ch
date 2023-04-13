import { useEffect, useRef } from "react";
import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { MergeView } from "@codemirror/merge";

const CodeDiffViewer = ({ left, right, lang, height }) => {
  const element = useRef(null);

  useEffect(
    () => {
      element.current.innerHTML = "";

      let extensions = [
        basicSetup,
        EditorState.readOnly.of(true),
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

      let leftExtensions = [
        EditorView.theme({
          ".cm-changedLine": {
            "background-color": "#ffeded !important",
          },
          ".cm-changedText": {
            "background-color": "#ffbaba !important",
          },
        }),
      ];

      let rightExtensions = [
        EditorView.theme({
          ".cm-changedLine": {
            "background-color": "#e8fbe8 !important",
          },
          ".cm-changedText": {
            "background-color": "#a6f1a6 !important",
          },
        }),
      ];

      new MergeView({
        a: {
          doc: left,
          extensions: [...extensions, ...leftExtensions],
        },
        b: {
          doc: right,
          extensions: [...extensions, ...rightExtensions],
        },
        parent: element.current,
        collapseUnchanged: {},
      });
    },
    [left, right]
  );

  return <div style={{ height: height }} ref={element} />;
};

export default CodeDiffViewer;
