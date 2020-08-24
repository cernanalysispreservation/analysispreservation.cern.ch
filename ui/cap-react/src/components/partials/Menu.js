import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import ReactDOM from "react-dom";

import { AiOutlineUser } from "react-icons/ai";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 5px;
  border-radius: 50%;
  background: ${props => (props.expanded ? props.hover : "inherit")};
  &:hover {
    background: ${props => props.hover};
    cursor: pointer;
  }
`;

const Menu = ({
  icon = <AiOutlineUser size={23} />,
  children,
  top = 48,
  right = 3,
  bottom = null,
  left = null,
  background = "",
  hoverColor = "rgba(235, 235, 235, 1)",
  iconWrapperClassName = ""
}) => {
  const [expanded, setExpanded] = useState(false);
  const dropDownMenu = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const escFunction = event => {
    // when the user clicks the ESC button
    // the menu will hide
    if (event.keyCode === 27) {
      setExpanded(false);
    }
  };

  // useEffect in order to capture clicks that are not in the menu
  useEffect(
    () => {
      function handleClickOutside(event) {
        const dom = ReactDOM.findDOMNode(dropDownMenu.current);
        if (dropDownMenu.current && !dom.contains(event.target)) {
          setExpanded(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    },
    [dropDownMenu]
  );

  return (
    <Box ref={dropDownMenu} className="menu">
      <Wrapper
        hover={hoverColor}
        expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className={iconWrapperClassName}
      >
        {icon}
      </Wrapper>
      <Box
        style={{
          position: "absolute",
          top: `${top}px`,
          right: `${right}px`,
          left: `${left}px`,
          bottom: `${bottom}px`,
          zIndex: 10000,
          minWidth: "120px",
          background: background
        }}
      >
        {expanded && children}
      </Box>
    </Box>
  );
};

Menu.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.element,
  top: PropTypes.number,
  bottom: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
  background: PropTypes.string,
  hoverColor: PropTypes.string
};

export default Menu;
