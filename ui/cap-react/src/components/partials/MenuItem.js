import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import styled from "styled-components";
import Anchor from "grommet/components/Anchor";
import { AiOutlineRight } from "react-icons/ai";

const Wrapper = styled(Anchor)`
  background: ${props => props.background};
  text-decoration: none;
  font-size: 1rem;
  line-height: 1.5;
  display: flex;
  padding: 0 10px;

  &:hover {
    background: rgba(0, 114, 152, 0.1);
    cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
    text-decoration: none;
  }
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
`;

const MenuItem = ({
  title,
  icon = null,
  path = null,
  onClick = null,
  href = "#",
  className = "",
  separator = false,
  background = "rgb(255, 255, 255)",
  dataCy = "",
  multipleMenu = null,
  headerTitle = false,
  target = "",
  disabled = false
}) => {
  return (
    <div className={className}>
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
        style={{
          padding: "2px 10px",
          borderBottom: separator ? "0.1px solid rgba(0, 0, 0, 0.1)" : ""
        }}
      >
        <Box justify="center">{icon}</Box>
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
          {multipleMenu && (
            <AiOutlineRight className="multipleMenuItemArrowBack" size={16} />
          )}
        </Box>
      </Wrapper>
    </div>
  );
};

MenuItem.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.element,
  path: PropTypes.string,
  href: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  separator: PropTypes.bool,
  background: PropTypes.string,
  dataCy: PropTypes.string,
  multipleMenu: PropTypes.bool,
  headerTitle: PropTypes.bool,
  target: PropTypes.string,
  disabled: PropTypes.bool
};

export default MenuItem;
