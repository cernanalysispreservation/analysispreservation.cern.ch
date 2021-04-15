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
    background: ${props => props.hovered && "rgba(235, 235, 235, 1)"};
    cursor: pointer;
    text-decoration: none;
  }
`;

const Item = styled.span`
  padding: 12px 24px;
  white-space: nowrap;
  color: ${props =>
    props.headerTitle ? "#000 !important" : "#666 !important"};
  letter-spacing: 0.7px;
  font-size: ${props => (props.headerTitle ? "22px" : "16px")};
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
  hovered = false,
  background = "rgb(255, 255, 255)",
  dataCy = "",
  multipleMenu = null,
  headerTitle = false,
  target = ""
}) => {
  return (
    <div className={className}>
      <Wrapper
        data-cy={dataCy}
        onClick={onClick}
        href={onClick ? null : href}
        path={path}
        target={target}
        responsive={false}
        hovered={hovered}
        className="not-underline"
        background={background}
        style={{
          paddingLeft: "10px",
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
          <Item headerTitle={headerTitle}>{title}</Item>
          {multipleMenu && <AiOutlineRight size={20} color="#666" />}
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
  hovered: PropTypes.bool,
  background: PropTypes.string,
  dataCy: PropTypes.string,
  multipleMenu: PropTypes.bool,
  headerTitle: PropTypes.bool,
  target: PropTypes.string
};

export default MenuItem;
