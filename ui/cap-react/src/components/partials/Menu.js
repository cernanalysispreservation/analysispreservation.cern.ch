import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import ReactDOM from "react-dom";
import Button from "./Button";

import { AiOutlineUser } from "react-icons/ai";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: ${props => props.padding};
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
  background = "#fff",
  hoverColor = "rgba(235, 235, 235, 1)",
  iconWrapperClassName = "",
  padding = "5px",
  minWidth = "100px",
  shadow = false,
  buttonProps = null,
  dataCy = ""
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
    <Box ref={dropDownMenu} className="menu" data-cy={dataCy}>
      {buttonProps ? (
        <Button
          primary
          {...buttonProps}
          onClick={() => setExpanded(!expanded)}
          icon={
            expanded
              ? buttonProps.iconOpen || buttonProps.icon
              : buttonProps.icon
          }
        />
      ) : (
        <Wrapper
          hover={hoverColor}
          expanded={expanded}
          padding={padding}
          onClick={() => setExpanded(!expanded)}
          className={iconWrapperClassName}
        >
          {icon}
        </Wrapper>
      )}
      <Box
        className="menuWrapper"
        style={{
          position: "absolute",
          top: `${top}px`,
          right: `${right}px`,
          left: `${left}px`,
          bottom: `${bottom}px`,
          zIndex: 10000,
          minWidth: minWidth,
          background: background,
          borderRadius: "5px",
          boxShadow: shadow && "rgba(0, 0, 0, 0.2) 10px 2px 50px"
        }}
      >
        {expanded && (
          <div className={expanded && "animatedMenu"}>{children}</div>
        )}
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
  hoverColor: PropTypes.string,
  padding: PropTypes.string,
  minWidth: PropTypes.string,
  shadow: PropTypes.bool,
  iconWrapperClassName: PropTypes.string,
  buttonProps: PropTypes.object,
  dataCy: PropTypes.string
};

export default Menu;
