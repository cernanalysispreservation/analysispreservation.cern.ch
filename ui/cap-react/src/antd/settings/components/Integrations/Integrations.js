import React from "react";
import PropTypes from "prop-types";
import { Card, Row, Col, Tag } from "antd";
import AuthPopUp from "./IntegrationPopUp";
import { CheckCircleOutlined } from "@ant-design/icons";
import IntegrationConnected from "./IntegrationConnected";
import { services } from "../../utils/services";

const Integrations = ({
  updateIntegrations,
  integrations,
  removeIntegrations
}) => {
  return (
    <Card title="Integrations with other services">
      <Row gutter={12}>
        {services.map(item => (
          <Col key={item} xs={{ span: 24 }} md={{ span: 12 }} xl={{ span: 6 }}>
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
                <AuthPopUp
                  service={item.name}
                  loginCallBack={() => updateIntegrations()}
                />
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
  removeIntegrations: PropTypes.func
};

export default Integrations;
