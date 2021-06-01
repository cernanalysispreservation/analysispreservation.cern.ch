import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import MenuItem from "../MenuItem";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Box } from "grommet";
import "./MultipleMenus.css";

const MultipleMenus = ({ children, displayMenu, menus, onClick }) => {
  const [shouldAnimationActive, setShouldAnimationActive] = useState(false);

  useEffect(
    () => {
      if (displayMenu && !shouldAnimationActive) setShouldAnimationActive(true);
    },
    [displayMenu]
  );

  return (
    <div
      style={{
        position: "relative",
        overflowX: "hidden",
        height: "100%",
        minHeight: "300px"
      }}
    >
      <div
        className={
          shouldAnimationActive
            ? displayMenu
              ? "main-menu main-menu-out"
              : "main-menu main-menu-in"
            : "main-menu"
        }
      >
        {children}
      </div>
      <div
        className={
          shouldAnimationActive
            ? displayMenu
              ? "embeded-menu embeded-menu-in"
              : "embeded-menu embeded-menu-out"
            : "embeded-menu"
        }
      >
        <MenuItem
          headerTitle
          separator
          title={displayMenu}
          onClick={() => {
            setShouldAnimationActive(true);
            onClick();
          }}
          href="#"
          icon={
            <Box
              style={{
                padding: "7px"
              }}
            >
              <AiOutlineArrowLeft color="#000" size={20} />
            </Box>
          }
        />
        {menus[displayMenu]}
      </div>
    </div>
  );
};

MultipleMenus.propTypes = {
  children: PropTypes.node,
  displayMenu: PropTypes.string,
  menus: PropTypes.object,
  onClick: PropTypes.func
};

export default MultipleMenus;
