import React from "react";
import PropTypes from "prop-types";
import { Typography, Row } from "antd";
import styled from "styled-components";

const StyledRow = styled(Row)`
  margin: 10px 0px;
  border-bottom: ${props => `1px solid ${props.borderColor}`};
  line-height: 1px;
`;

const StyledText = styled(Typography.Text)`
  background-color: ${props => props.background};
  color: ${props => props.color};
  margin-bottom: -10px;
  padding: 10px;
`;

const LineText = ({
  text,
  background = "#fff",
  color = "#000",
  borderColor = "#e1e1e1"
}) => {
  return (
    <StyledRow justify="center" borderColor={borderColor}>
      <StyledText background={background} color={color}>
        {text}
      </StyledText>
    </StyledRow>
  );
};

LineText.propTypes = {
  text: PropTypes.string,
  background: PropTypes.string,
  color: PropTypes.string,
  borderColor: PropTypes.string
};

export default LineText;
