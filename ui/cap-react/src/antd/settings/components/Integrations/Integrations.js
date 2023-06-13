import PropTypes from "prop-types";
import { Card, Row, Col, Tag, Typography, Space } from "antd";
import AuthPopUp from "./IntegrationPopUp";
import { CheckCircleOutlined } from "@ant-design/icons";
import IntegrationConnected from "./IntegrationConnected";
import { services } from "../../utils/services";

const Integrations = ({
  updateIntegrations,
  integrations,
  removeIntegrations,
}) => {
  return (
    <Card title="Integrations with other services">
      <Row gutter={[6, 6]}>
        {services.map(item => (
          <Col key={item} xs={24} md={12}>
            <Card
              title={item.label}
              extra={
                integrations &&
                integrations[item.name] && (
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Connected
                  </Tag>
                )
              }
            >
              {integrations && integrations[item.name] ? (
                <IntegrationConnected
                  name={item.name}
                  data={integrations[item.name]}
                  onClick={() => removeIntegrations(item.name)}
                />
              ) : (
                <Row>
                  <Col style={{ textAlign: "center" }} xs={{ span: 24 }}>
                    <Space
                      style={{ width: "100%" }}
                      direction="vertical"
                      size="large"
                    >
                      <Typography.Title level={5}>
                        Connect to {item.label}
                      </Typography.Title>

                      <AuthPopUp
                        service={item.name}
                        loginCallBack={() => updateIntegrations()}
                      />
                    </Space>
                  </Col>
                </Row>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

Integrations.propTypes = {
  updateIntegrations: PropTypes.func,
  integrations: PropTypes.object,
  removeIntegrations: PropTypes.func,
};

export default Integrations;
