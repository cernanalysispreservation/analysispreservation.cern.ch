import React from "react";
import PropTypes from "prop-types";
import { Button, Col, Row, Space, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";

const IntegrationConnected = ({ name, data, onClick }) => {
  return ["github", "gitlab"].includes(name) ? (
    <Row>
      <Col style={{ textAlign: "center" }} xs={{ span: 24 }}>
        <Space style={{ width: "100%" }} direction="vertical" size="large">
          <div>
            <Typography.Title level={5}>{data.name}</Typography.Title>
            <Button
              icon={<LinkOutlined />}
              type="link"
              target="_blank"
              href={data.profile_url}
            >
              {data.username}
            </Button>
          </div>
          <Button type="secondary" onClick={onClick}>
            Disconnect
          </Button>
        </Space>
      </Col>
    </Row>
  ) : (
    <Row>
      <Col style={{ textAlign: "center" }} span={12} offset={6}>
        <Space style={{ width: "100%" }} direction="vertical" size="large">
          <Typography.Title level={5}>{data.name}</Typography.Title>
          <Button type="secondary" onClick={onClick}>
            Disconnect
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

IntegrationConnected.propTypes = {
  name: PropTypes.string,
  data: PropTypes.object,
  onClick: PropTypes.func
};

export default IntegrationConnected;
