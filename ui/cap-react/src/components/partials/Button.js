import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import Box from "grommet/components/Box";
import Spinning from "grommet/components/icons/Spinning";

const ButtonWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: ${props => props.background};
  color: ${props => props.color};
  height: ${props => props.size.height};
  min-width: ${props => props.size.width || "64px"};
  padding: ${props => props.size.padding};
  font-size: ${props => props.size.fontSize};
  line-height: 1.75;
  border-radius: 2px;
  cursor: pointer;
  margin: ${props => props.margin};

  &:hover {
    background: ${props => props.hoverColor};
  }

  &:hover {
    background: ${props => props.hoverBackground};
  }

  ${({ primary }) =>
    primary &&
    css`
      background: #007298;
      color: #ffffff;

      &:hover {
        background: #3388a9;
      }
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

      cursor: not-allowed;

      &:hover {
        background: #f5f5f5;
      }
    `};

  ${({ tertiary }) =>
    tertiary &&
    css`
      text-decoration: underline;
    `};

  ${({ critical }) =>
    critical &&
    css`
      background: #f4282d;
      color: #ffffff;
      &:hover {
        background-color: #ff324d;
      }
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
  hoverColor = "#e6e6e6",
  color = "#333",
  margin = "",
  loading = false,
  size = "medium",
  reverse = false,
  className = "",
  id = ""
}) => {
  const getPadFromSize = size => {
    const choices = {
      iconSmall: {
        height: "24px",
        padding: "1px",
        fontSize: "14px",
        width: "24px"
      },
      icon: {
        height: "37px",
        padding: "1px",
        fontSize: "14px",
        width: "37px"
      },
      iconMedium: {
        height: "45px",
        padding: "5px",
        fontSize: "14px",
        width: "45px"
      },
      iconLarge: {
        height: "49px",
        padding: "5px",
        fontSize: "14px",
        width: "49px"
      },
      small: {
        height: "24px",
        padding: "0 7px",
        fontSize: "14px"
      },
      medium: {
        padding: "6px 16px",
        height: "32px",
        fontSize: "16px"
      },
      large: {
        height: "40px",
        padding: "8px 22px",
        fontSize: "16px"
      },
      xlarge: {
        height: "40px",
        padding: "10px 30px",
        fontSize: "16px"
      },
      xxlarge: {
        height: "40px",
        padding: "15px 35px",
        fontSize: "16px"
      }
    };

    return choices[size] || choices["medium"];
  };

  const getLoadingLeft = size => {
    const choices = {
      small: 1,
      medium: 2,
      large: 5,
      xlarge: 5,
      xxlarge: 8
    };

    return choices[size];
  };

  const getOrderFromProps = reverse => {
    const choices = {
      true: (
        <React.Fragment>
          {text}
          {icon && (
            <Box
              margin={{
                left: text ? "small" : null
              }}
            >
              {icon}
            </Box>
          )}
        </React.Fragment>
      ),
      false: (
        <React.Fragment>
          {icon && (
            <Box
              margin={{
                right: text ? "small" : null
              }}
            >
              {icon}
            </Box>
          )}
          {text}
        </React.Fragment>
      )
    };

    return choices[reverse];
  };
  return (
    <ButtonWrapper
      margin={margin}
      size={getPadFromSize(size)}
      onClick={loading || disabled ? null : onClick}
      secondary={secondary}
      disabled={loading ? true : disabled}
      primary={primary}
      tertiary={tertiary}
      critical={critical}
      background={background}
      hoverColor={hoverColor}
      color={color}
      className={className}
      id={id}
    >
      {loading && (
        <Box style={{ position: "absolute", left: getLoadingLeft(size) }}>
          <Spinning size="xsmall" />
        </Box>
      )}
      {getOrderFromProps(reverse)}
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
  size: PropTypes.oneOf([
    "small",
    "medium",
    "large",
    "xlarge",
    "xxlarge",
    "icon",
    "iconSmall",
    "iconMedium",
    "iconLarge"
  ]),
  hoverColor: PropTypes.string,
  reverse: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string
};

export default Button;
