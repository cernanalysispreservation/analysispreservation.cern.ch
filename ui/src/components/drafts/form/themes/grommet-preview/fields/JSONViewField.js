import React, { Component } from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Paragraph from "grommet/components/Paragraph";

import ReactJson from "react-json-view";

import CodeIcon from "grommet/components/icons/base/Code";

import _isEmpty from "lodash/isEmpty";

class JSONEditorWidget extends Component {
  constructor(props) {
    super(props);

    this.state = { editorOpen: false };
  }

  render() {
    return (
      <Box
        pad={{ horizontal: "medium" }}
        style={{ overflow: "hidden" }}
        size={{ width: "xxlarge" }}
        justify="center"
        flex={false}
        alignSelf="end"
      >
        <Box pad="none" colorIndex="light-2">
          <div
            style={{
              position: "relative",
              height: "auto",
              maxHeight: "200px",
              overflow: "scroll",
              textOverflow: "hidden"
            }}
          >
            <pre> {JSON.stringify(this.props.formData, null, 4)} </pre>
          </div>
        </Box>
      </Box>
    );
  }
}

JSONEditorWidget.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  onBlur: PropTypes.func
};

export default JSONEditorWidget;
