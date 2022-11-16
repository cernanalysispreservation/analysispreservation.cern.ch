import React from "react";
import PropTypes from "prop-types";
import { Button, Card, Col, PageHeader, Row, Typography } from "antd";
import { withRouter } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const NotificationList = ({
  category,
  schemaConfig,
  history,
  createNewNotification,
}) => {
  const items = schemaConfig && schemaConfig.get(category);
  const {
    location: { pathname },
    push,
  } = history;

  return (
    <Row style={{ padding: "10px" }}>
      <Col span={24}>
        <PageHeader
          title={`${category} notifications`}
          subTitle={`Send an email notification to users when a ${category} event takes place`}
          extra={
            <Button
              type="primary"
              onClick={() => createNewNotification(category)}
              icon={<PlusOutlined />}
            >
              Add notification
            </Button>
          }
        />
        <Row gutter={[16, 16]}>
          {items &&
            items.map((item, index) => (
              <Col span={6} key={item}>
                <Card
                  title={`Notification #${index + 1}`}
                  extra={
                    <Button onClick={() => push(pathname + "/" + index)}>
                      See more
                    </Button>
                  }
                >
                  <Typography.Text>{item.get("subject")}</Typography.Text>
                </Card>
              </Col>
            ))}
        </Row>
      </Col>
    </Row>
  );
};

NotificationList.propTypes = {
  category: PropTypes.string,
  schemaConfig: PropTypes.object,
  history: PropTypes.object,
  createNewNotification: PropTypes.func,
};

export default withRouter(NotificationList);
