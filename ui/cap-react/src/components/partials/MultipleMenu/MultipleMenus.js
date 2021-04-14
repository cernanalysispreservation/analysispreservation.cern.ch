import React from "react";
import PropTypes from "prop-types";
import MenuItem from "../MenuItem";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { Box } from "grommet";
import "./MultipleMenus.css";

const MultipleMenus = ({ children, displayMenu, menus, onClick }) => {
  return (
    <div>
      <div className={displayMenu ? "hide" : "show"}>{children}</div>
      <div className={displayMenu ? "show" : "hide"}>
        <MenuItem
          headerTitle
          separator
          title={displayMenu}
          onClick={() => onClick()}
          href="#"
          icon={
            <Box
              style={{
                padding: "7px"
              }}
            >
              <AiOutlineArrowLeft
                className="multipleMenuItemArrowBack"
                size={16}
              />
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
