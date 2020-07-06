import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Box from "grommet/components/Box";
import Spinning from "grommet/components/icons/Spinning";

const ButtonWrapper = styled(Box)`
  align-items: center;
  justify-content: center;
  background: ${props => props.background};
  color: ${props => props.color};

  &:hover {
    background: ${props => props.hoverBackground};
  }

  ${({ primary }) =>
    primary &&
    css`
      background: #0096d6;
      color: #ffffff;
    `};

  ${({ secondary }) =>
    secondary &&
    css`
      border: 1px solid rgba(0, 0, 0, 0.2);
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      background: #f5f5f5;
      color: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(0, 0, 0, 0.15);
      cursor: not-allowed;
    `};

  ${({ tertiary }) =>
    tertiary &&
    css`
      text-decoration: underline;
    `};

  ${({ critical }) =>
    critical &&
    css`
      background-color: #ff324d;
      color: #ffffff;
    `};
`;

const Button = ({
  text = "",
  primary = false,
  onClick = null,
  secondary = false,
  disabled = false,
  tertiary = false,
  critical = false,
  icon = null,
  background = "#f5f5f5",
  color = "#333",
  hoverBackground = "",
  pad = { horizontal: "medium", vertical: "small" },
  margin = {
    horizontal: "",
    vertical: "",
    top: "",
    right: "",
    left: "",
    bottom: ""
  },
  loading = false
}) => {
  return (
    <ButtonWrapper
      pad={{ horizontal: pad.horizontal, vertical: pad.vertical }}
      margin={{
        horizontal: margin.horizontal,
        vertical: margin.vertical,
        top: margin.top,
        right: margin.right,
        left: margin.left,
        bottom: margin.bottom
      }}
      direction="row"
      responsive={false}
      onClick={loading ? null : onClick}
      secondary={secondary}
      disabled={loading ? true : disabled}
      primary={primary}
      tertiary={tertiary}
      critical={critical}
      background={background}
      hoverBackground={hoverBackground}
      color={color}
      style={{
        position: "relative"
      }}
    >
      {loading && (
        <Box style={{ position: "absolute", left: 5 }}>
          <Spinning size="xsmall" />
        </Box>
      )}
      {icon && <Box margin={{ right: text ? "small" : "" }}>{icon}</Box>}
      {text}
    </ButtonWrapper>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  secondary: PropTypes.bool,
  disabled: PropTypes.bool,
  tertiary: PropTypes.bool,
  icon: PropTypes.element,
  critical: PropTypes.bool,
  background: PropTypes.string,
  color: PropTypes.string,
  pad: PropTypes.object,
  margin: PropTypes.object,
  loading: PropTypes.bool,
  hoverBackground: PropTypes.string
};

export default Button;
