import React, { useRef } from "react";
import PropTypes from "prop-types";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Toggler from "./RichEditorPreviewPlugin";

const RichEditor = props => {
  const mdParser = new MarkdownIt();

  let myEditor = useRef(null);

  const handleEditorChange = values => {
    props.onChange(values.text);
  };

  MdEditor.use(Toggler, {
    isEditView: { html: false, md: true }
  });

  return (
    <MdEditor
      style={{ height: "500px" }}
      config={{
        canView: {
          fullScreen: false,
          md: false,
          html: false,
          ...props.canViewProps
        },
        view: { html: false, md: true, ...props.viewProps }
      }}
      readOnly={props.readonly}
      renderHTML={text => mdParser.render(text)}
      onChange={handleEditorChange}
      value={props.value}
      ref={myEditor}
    />
  );
};

RichEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  readonly: PropTypes.bool,
  displayedFromModal: PropTypes.bool,
  canViewProps: PropTypes.object,
  viewProps: PropTypes.object
};

export default RichEditor;