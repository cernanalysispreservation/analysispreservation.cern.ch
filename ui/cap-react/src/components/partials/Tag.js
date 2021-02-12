import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledTag = styled.span`
  color: ${props => props.color};
  background: ${props => props.bgcolor};
  padding: ${props => props.padding};
  margin: ${props => props.margin};
  border-radius: 3px;
  border: ${props => `1px solid ${props.border}`};
  max-width: ${props => props.maxWidth};
  word-break: break-all;
  line-height: 20px;
`;

const Tag = ({
  text,
  size = "medium",
  color = {
    bgcolor: "#fafafa",
    border: "#d9d9d9",
    color: "rgba(0,0,0,0.65)"
  },
  margin = "",
  maxWidth = "300px"
}) => {
  const getPaddingBySize = size => {
    const choices = {
      small: "0px 5px",
      medium: "1px 6px",
      large: "5px 10px"
    };

    return choices[size];
  };
  return (
    <StyledTag
      bgcolor={color.bgcolor}
      border={color.border}
      color={color.color}
      padding={getPaddingBySize(size)}
      margin={margin}
      maxWidth={maxWidth}
    >
      {text}
    </StyledTag>
  );
};

Tag.propTypes = {
  color: PropTypes.shape({
    bgcolor: PropTypes.string,
    border: PropTypes.string,
    color: PropTypes.string
  }),
  text: PropTypes.string,
  size: PropTypes.string,
  margin: PropTypes.string,
  maxWidth: PropTypes.string
};

export default Tag;
