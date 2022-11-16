import React from "react";
import PropTypes from "prop-types";
import { Button, Col, PageHeader, Row } from "antd";
import Form from "../../../forms/Form";
import { schema, uiSchema } from "../utils";
import { DeleteOutlined } from "@ant-design/icons";
const NotificationEdit = ({
  schemaConfig,
  match,
  history,
  removeNotification,
  updateNotificationData,
}) => {
  const { id, category } = match.params;

  const formData = schemaConfig && schemaConfig.get(category).get(id).toJS();

  return (
    <React.Fragment>
      <PageHeader
        title="New Notification"
        onBack={() =>
          history.push(history.location.pathname.split(`/${id}`)[0])
        }
        extra={
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeNotification(id, category)}
          >
            Delete
          </Button>
        }
      />
      <Row justify="center">
        <Col span={12}>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            onChange={({ formData }) =>
              updateNotificationData(formData, id, category)
            }
            formData={formData}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};

NotificationEdit.propTypes = {
  schemaConfig: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  removeNotification: PropTypes.func,
  updateNotificationData: PropTypes.func,
};

export default NotificationEdit;
