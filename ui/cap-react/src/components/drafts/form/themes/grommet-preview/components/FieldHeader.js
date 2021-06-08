import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import MarkdownInline from "../../../../../partials/MarkdownInline";

let FieldHeader = function(props) {
  return props.title ? (
    <Box flex={true} style={{ overflow: "hidden" }}>
      <MarkdownInline
        style={{
          fontWeight: props.bold ? 600 : 300,
          fontStyle: props.italic ? "italic" : "normal",
          fontSize: "0.875rem",
          lineHeight: 1.71429,
          color: "#666"
        }}
        text={props.title}
        renderAsHtml={
          props.uiSchema["ui:options"] &&
          props.uiSchema["ui:options"].titleIsMarkdown
        }
      />
    </Box>
  ) : null;
};

FieldHeader.propTypes = {
  title: PropTypes.string,
  bold: PropTypes.bool,
  italic: PropTypes.bool,
  uiSchema: PropTypes.object
};

export default FieldHeader;
