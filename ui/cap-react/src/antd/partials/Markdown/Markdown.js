import React from "react";
import PropTypes from "prop-types";
import { markedInput, sanitizedInput } from "./marked";

const Markdown = ({ renderAsHtml, text }) => {
  return renderAsHtml ? (
    <span
      dangerouslySetInnerHTML={{
        __html: renderAsHtml && sanitizedInput(markedInput(text))
      }}
    />
  ) : (
    <span>{text}</span>
  );
};

Markdown.propTypes = {};

export default Markdown;
