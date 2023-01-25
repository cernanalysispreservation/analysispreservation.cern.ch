import React from "react";
import PropTypes from "prop-types";
import { Menu, Tooltip, Grid, Button } from "antd";
import "./HeaderMenuItem.less";

const { useBreakpoint } = Grid;

const HeaderMenuItem = ({ icon, label, onClick, type }) => {
  const screens = useBreakpoint();

  return (
    <Tooltip title={!screens.lg && label}>
      <Menu.Item
        icon={!type && icon}
        onClick={!type && onClick}
        className="no-bottom-border"
        style={!screens.lg && { padding: "0 10px" }}
      >
        {type ? (
          <Button icon={icon} type={type} onClick={onClick}>
            {screens.lg && label}
          </Button>
        ) : (
          screens.lg && label
        )}
      </Menu.Item>
    </Tooltip>
  );
};

HeaderMenuItem.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

export default HeaderMenuItem;
