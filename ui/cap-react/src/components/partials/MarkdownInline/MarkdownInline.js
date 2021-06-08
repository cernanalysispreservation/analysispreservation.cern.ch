import React from "react";
import PropTypes from "prop-types";
import { markedInput, sanitizedInput } from "../../utils/marked";

const MarkdownInline = ({ style = null, text = "", renderAsHtml = false }) => {
  return renderAsHtml ? (
    <span
      style={style}
      dangerouslySetInnerHTML={{
        __html: renderAsHtml && sanitizedInput(markedInput(text))
      }}
    />
  ) : (
    <span style={style}>{text}</span>
  );
};

MarkdownInline.propTypes = {
  text: PropTypes.string,
  style: PropTypes.object,
  renderAsHtml: PropTypes.bool
};

export default MarkdownInline;
