import React, { useRef } from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import PropTypes from "prop-types";
import Toggler from "./RichEditorPreviewPlugin";
import "./RichEditorWidget.css";
import { Box } from "grommet";

MdEditor.use(Toggler, {
  isEditView: { html: false, md: true }
});

const RichEditorWidget = props => {
  const mdParser = new MarkdownIt();

  let myEditor = useRef(null);

  const handleEditorChange = values => {
    props.onChange(values.text);
  };

  return (
    <Box
      className="richeditor-theme-grommet"
      pad={{ horizontal: "medium" }}
      flex={true}
    >
      <MdEditor
        style={{ height: "500px" }}
        config={{
          canView: { fullScreen: false, md: false, html: false },
          view: { html: false, md: true }
        }}
        readOnly={props.readonly}
        renderHTML={text => mdParser.render(text)}
        onChange={handleEditorChange}
        value={props.value}
        ref={myEditor}
      />
    </Box>
  );
};

RichEditorWidget.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  readonly: PropTypes.bool,
  displayedFromModal: PropTypes.bool
};

export default RichEditorWidget;
