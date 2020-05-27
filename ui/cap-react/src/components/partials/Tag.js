import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledTag = styled.span`
  color: ${props => props.color};
  background: ${props => props.bgcolor};
  padding: 3px 8px;
  border-radius: 3px;
  border: ${props => `1px solid ${props.border}`};
`;

const Tag = ({
  text,
  color = {
    bgcolor: "#fafafa",
    border: "#d9d9d9",
    color: "rgba(0,0,0,0.65)"
  }
}) => {
  return (
    <StyledTag
      bgcolor={color.bgcolor}
      border={color.border}
      color={color.color}
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
  text: PropTypes.string
};

export default Tag;
