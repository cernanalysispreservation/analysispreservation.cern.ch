import React from "react";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import PropTypes from "prop-types";
import "./RichEditorWidget.css";

const RichEditorWidget = props => {
  const mdParser = new MarkdownIt();

  return (
    <MdEditor
      style={{ height: "100%" }}
      config={{
        view: { menu: false, md: false, html: true }
      }}
      value={props.value}
      readOnly
      renderHTML={text => mdParser.render(text)}
    />
  );
};

RichEditorWidget.propTypes = {
  value: PropTypes.string
};

export default RichEditorWidget;
