import PropTypes from "prop-types";
import { Button, Col, Row, Space, Typography } from "antd";
import { LinkOutlined } from "@ant-design/icons";

const IntegrationConnected = ({ name, data, onClick }) => {
  return ["github", "gitlab"].includes(name) ? (
    <Row justify="center">
      <Col xs={{ span: 16 }} style={{ textAlign: "center" }}>
        <Space style={{ width: "100%" }} direction="vertical" size="large">
          <Button
            icon={<LinkOutlined />}
            type="link"
            target="_blank"
            href={data.profile_url}
          >
            {data.name}
          </Button>

          <Button type="secondary" onClick={onClick}>
            Disconnect
          </Button>
        </Space>
      </Col>
    </Row>
  ) : (
    <Row justify="center">
      <Col xs={{ span: 20 }} style={{ textAlign: "center" }}>
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
