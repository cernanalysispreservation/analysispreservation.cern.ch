import React from "react";
import PropTypes from "prop-types";

import Applications from "./containers/Applications";
import Integrations from "./containers/Integrations";
import Profile from "./containers/Profile";

import "./Settings.less";
import { Row, Col, Space } from "antd";

const Settings = () => {
  return (
    <Row>
      <Col
        xs={{ span: 22, offset: 1 }}
        md={{ span: 20, offset: 2 }}
        lg={{ span: 18, offset: 3 }}
        xl={{ span: 16, offset: 4 }}
        xxl={{ span: 14, offset: 5 }}
        style={{
          padding: "10px 0"
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Profile />
          <Applications />
          <Integrations />
        </Space>
      </Col>
    </Row>
  );
};

Settings.propTypes = {};

export default Settings;
