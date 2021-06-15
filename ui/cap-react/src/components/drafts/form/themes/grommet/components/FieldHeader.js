import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Anchor from "../../../../../partials/Anchor";
import MarkdownInline from "../../../../../partials/MarkdownInline";

let FieldHeader = function(props) {
  const {
    title,
    required,
    description,
    uiSchema = {},
    titleStyle = {},
    descriptionStyle = {}
  } = props;

  return (
    <Box
      direction="row"
      responsive={false}
      margin={props.margin ? props.margin : { vertical: "small" }}
    >
      <Box flex={true} justify="center">
        <Box flex>
          {title && (
            <span>
              <MarkdownInline
                text={title}
                style={{
                  color: "#000",
                  ...titleStyle
                }}
                renderAsHtml={
                  uiSchema["ui:options"] &&
                  uiSchema["ui:options"].titleIsMarkdown
                }
              />
              {required && <strong style={{ padding: "0 3px" }}>*</strong>}
              {description && (
                <MarkdownInline
                  text={description}
                  style={{
                    color: "#666",
                    fontSize: "0.875rem",
                    lineHeight: "24px",
                    ...descriptionStyle
                  }}
                  renderAsHtml={
                    uiSchema["ui:options"] &&
                    uiSchema["ui:options"].descriptionIsMarkdown
                  }
                />
              )}
            </span>
          )}
        </Box>
      </Box>
      {props.enableLatex && (
        <Box
          flex={false}
          align="center"
          justify="start"
          margin={{ right: "small" }}
        >
          <Anchor
            alignSelf="center"
            direction="row"
            responsive={false}
            flex={false}
            wrap={false}
            align="start"
            style={{ paddingTop: "4px", textDecoration: "underline" }}
            onClick={props.enableLatex}
          >
            Export LaTeX
          </Anchor>
        </Box>
      )}
      {props.pasteable &&
        !props.readonly && (
          <Box flex={false} align="center" justify="start">
            <Anchor
              alignSelf="center"
              direction="row"
              flex={false}
              wrap={false}
              align="start"
              style={{ paddingTop: "4px", textDecoration: "underline" }}
              onClick={props.enableImport}
            >
              Import from a list
            </Anchor>
          </Box>
        )}
    </Box>
  );
};

FieldHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  margin: PropTypes.string,
  onArrayAddClick: PropTypes.func,
  required: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.object,
  readonly: PropTypes.bool,
  enableImport: PropTypes.func,
  enableLatex: PropTypes.func,
  pasteable: PropTypes.object,
  titleStyle: PropTypes.object,
  descriptionStyle: PropTypes.object
};

export default FieldHeader;
