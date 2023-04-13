import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Card, Col, Row, Typography } from "antd";
import { PageHeader } from "@ant-design/pro-layout";
import { withRouter } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import NotificationEdit from "../containers/NotificationEdit";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

const NotificationList = ({
  category,
  schemaConfig,
  createNewNotification,
}) => {
  const items = schemaConfig && schemaConfig.get(category);

  const [notificationIndex, setNotificationIndex] = useState(-1);

  useEffect(() => setNotificationIndex(-1), [category]);

  const screens = useBreakpoint();

  return notificationIndex > -1 ? (
    <NotificationEdit
      category={category}
      index={notificationIndex}
      onBack={() => setNotificationIndex(-1)}
    />
  ) : (
    <Row style={{ padding: "10px" }}>
      <Col span={24}>
        <PageHeader
          title={`${category} notifications`}
          subTitle={
            screens.sm &&
            `Send an email notification to users when a ${category} event takes place`
          }
          extra={
            <Button
              type="primary"
              onClick={() =>
                setNotificationIndex(createNewNotification(category))
              }
              icon={<PlusOutlined />}
            >
              {screens.sm && "Add notification"}
            </Button>
          }
        />
        <Row gutter={[16, 16]}>
          {items &&
            items.map((item, index) => (
              <Col xs={24} sm={6} key={item}>
                <Card
                  title={`Notification #${index + 1}`}
                  extra={
                    <Button onClick={() => setNotificationIndex(index)}>
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
  createNewNotification: PropTypes.func,
};

export default withRouter(NotificationList);
