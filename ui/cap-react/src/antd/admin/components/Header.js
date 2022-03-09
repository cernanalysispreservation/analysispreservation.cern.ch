import React from "react";
import PropTypes from "prop-types";
import { Button, Row, Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { CMS } from "../../../components/routes";

const Header = ({ config, pushPath, pathname }) => {
  return (
    <Row align="middle" justify="space-between" style={{ color: "#fff" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => pushPath(CMS)}
        type="primary"
      >
        Admin Page
      </Button>
      <Space>
        <Button type={pathname.includes("/builder") && "primary"}>
          Form Builder
        </Button>
        <Button type={pathname.includes("/notifications") && "primary"}>
          Notifications
        </Button>
      </Space>
      <div>utils</div>
    </Row>
  );
};

Header.propTypes = {
  config: PropTypes.object,
  pushPath: PropTypes.func,
  pathname: PropTypes.string
};

export default Header;
