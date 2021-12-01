import React from "react";

import Applications from "./containers/Applications";
import Integrations from "./containers/Integrations";
import Profile from "./containers/Profile";

import "./Settings.less";
import { Row, Col, Space } from "antd";

const Settings = () => {
  return (
    <Row justify="center">
      <Col xs={22} sm={20} md={18} lg={16} xl={12} className="__Settings__">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Profile />
          <Applications />
          <Integrations />
        </Space>
      </Col>
    </Row>
  );
};

export default Settings;
