import React from "react";
import PropTypes from "prop-types";
import { Col, Grid, Drawer } from "antd";
import SideBar from "../../containers/SideBar";

const DraftSideBar = ({ visibleFileDrawer, onClose }) => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  return !screens.xxl ? (
    <Drawer
      title="File Settings"
      placement="right"
      onClose={onClose}
      visible={visibleFileDrawer}
      key="fileSettings"
      size="large"
      bodyStyle={{ padding: "5px" }}
      contentWrapperStyle={{ width: !screens.lg ? "80%" : "40%" }}
    >
      <SideBar />
    </Drawer>
  ) : (
    <Col xxl={5}>
      <SideBar />
    </Col>
  );
};

DraftSideBar.propTypes = {
  visibleFileDrawer: PropTypes.bool,
  onClose: PropTypes.func
};

export default DraftSideBar;
