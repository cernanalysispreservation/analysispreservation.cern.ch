import React from "react";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";

const JinjaEditorWidget = props => {
  return (
    <AceEditor
      mode="django"
      theme="github"
      showPrintMargin={false}
      showGutter={false}
      highlightActiveLine={false}
      width="100%"
      height="200px"
      name="UNIQUE_ID_OF_DIV"
      value={props.value}
      onChange={val => props.onChange(val)}
      editorProps={{ $blockScrolling: true }}
    />
  );
};

JinjaEditorWidget.propTypes = {};

export default JinjaEditorWidget;
