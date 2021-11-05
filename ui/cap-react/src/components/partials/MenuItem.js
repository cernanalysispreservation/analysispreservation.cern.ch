import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import styled, { css } from "styled-components";
import Anchor from "grommet/components/Anchor";
import { AiOutlineRight } from "react-icons/ai";

const Wrapper = styled(Anchor)`
  text-decoration: none !important;
  font-size: 1rem;
  line-height: 1.5;
  display: flex;
  padding: 4px 10px;
  border-radius: 5px;
`;

const Item = styled.span`
  padding: 5px;
  white-space: nowrap;
  line-height: 1.5;
  color: ${props =>
    props.headerTitle ? "#000 !important" : "#666 !important"};
  letter-spacing: 0.7px;
  font-size: ${props => (props.headerTitle ? "20px" : "14px")};
  font-weight: ${props => (props.headerTitle ? 500 : 400)};

  &:hover {
    text-decoration: none !important;
  }

  ${Wrapper}:hover & {
    color: #007298 !important;
  }
`;

const Div = styled.div`
  ${({ dividerTop }) =>
    dividerTop &&
    css`
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      padding: 5px 0;
      margin-top: 2px;
    `};
  ${({ dividerBottom }) =>
    dividerBottom &&
    css`
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 5px 0;
      margin-bottom: 2px;
    `};
  border-radius: 5px;
  :hover {
    background: rgba(0, 114, 152, 0.1);
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
    text-decoration: none !important;
    border-radius: 0 !important;
  }
  &:first-child {
    border-top-right-radius: 5px !important;
    border-top-left-radius: 5px !important;
  }
  &:last-child {
    border-bottom-right-radius: 5px !important;
    border-bottom-left-radius: 5px !important;
  }
`;

const RightArrow = styled(AiOutlineRight)`
  color: #666;

  ${Wrapper}:hover & {
    color: #007298;
  }
`;

const IconBox = styled(Box)`
  color: #000;

  ${Wrapper}:hover & {
    color: #007298;
  }
`;

const MenuItem = ({
  title,
  icon = null,
  path = null,
  onClick = null,
  href = "#",
  className = "",
  background = "rgb(255, 255, 255)",
  dataCy = "",
  multipleMenu = null,
  headerTitle = false,
  target = "",
  disabled = false,
  dividerTop = false,
  dividerBottom = false
}) => {
  return (
    <Div
      className={className}
      dividerTop={dividerTop}
      dividerBottom={dividerBottom}
    >
      <Wrapper
        data-cy={dataCy}
        onClick={onClick}
        href={onClick ? null : href}
        path={!disabled && path}
        target={target}
        responsive={false}
        disabled={disabled}
        className="not-underline"
        background={background}
      >
        <IconBox justify="center">{icon}</IconBox>
        <Box
          direction="row"
          justify="between"
          flex
          align="center"
          responsive={false}
        >
          <Item headerTitle={headerTitle} disabled={disabled}>
            {title}
          </Item>
          {multipleMenu && <RightArrow size={16} />}
        </Box>
      </Wrapper>
    </Div>
  );
};

MenuItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  path: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  hovered: PropTypes.bool,
  background: PropTypes.string,
  dataCy: PropTypes.string,
  multipleMenu: PropTypes.bool,
  headerTitle: PropTypes.bool,
  disabled: PropTypes.bool,
  target: PropTypes.string,
  dividerTop: PropTypes.bool,
  dividerBottom: PropTypes.bool
};

export default MenuItem;
