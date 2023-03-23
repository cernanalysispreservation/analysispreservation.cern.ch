import React from "react";
import PropTypes from "prop-types";
import { Button, Col, PageHeader, Popconfirm, Row } from "antd";
import Form from "../../../forms/Form";
import { schema, uiSchema } from "../utils";
import { DeleteOutlined } from "@ant-design/icons";
const NotificationEdit = ({
  schemaConfig,
  removeNotification,
  updateNotificationData,
  category,
  index,
  onBack,
}) => {
  const formData =
    schemaConfig &&
    schemaConfig.get(category).get(index) &&
    schemaConfig
      .get(category)
      .get(index)
      .toJS();

  return (
    <React.Fragment>
      <PageHeader
        title={`Notification #${index + 1}`}
        onBack={onBack}
        extra={
          <Popconfirm
            title="Delete notification"
            okType="danger"
            okText="Delete"
            cancelText="Cancel"
            placement="left"
            onConfirm={() => {
              removeNotification(index, category);
              onBack();
            }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        }
      />
      <Row justify="center">
        <Col span={12}>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            onChange={({ formData }) =>
              updateNotificationData(formData, index, category)
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
  removeNotification: PropTypes.func,
  updateNotificationData: PropTypes.func,
  category: PropTypes.string,
  index: PropTypes.number,
  onBack: PropTypes.func,
};

export default NotificationEdit;
