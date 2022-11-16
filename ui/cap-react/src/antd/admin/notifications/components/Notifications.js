import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Layout, Menu, Typography, Modal, Input } from "antd";
import NotificationList from "../containers/NotificationList";
import { CMS_NOTIFICATION } from "../../../../components/routes";

import { PlusOutlined } from "@ant-design/icons";

const Notifications = ({
  schemaConfig,
  pathname,
  match,
  history,
  createNotificationCategory,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    let values = [];
    schemaConfig && schemaConfig.mapKeys((key) => values.push(key));
    if (match.path == CMS_NOTIFICATION) {
      history.push(pathname + "/" + values[0]);
    }
  }, []);

  const { category } = match.params;

  return (
    <Layout style={{ height: "100%", padding: 0 }}>
      <Modal
        visible={modalVisible}
        open={open}
        title="Create a new collection"
        okText="Create"
        cancelText="Cancel"
        onCancel={() => {
          form.resetFields();
          setModalVisible(false);
        }}
        onOk={() => {
          form.validateFields().then((values) => {
            form.resetFields();
            createNotificationCategory(values.title);
          });
        }}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              {
                required: true,
                message: "Please input the title of collection!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Layout.Sider>
        <Typography.Title
          level={5}
          style={{ color: "#fff", textAlign: "center" }}
        >
          Notifications
        </Typography.Title>
        <Menu selectable selectedKeys={category} theme="dark">
          {schemaConfig &&
            schemaConfig.entrySeq().map((item) => (
              <Menu.Item
                key={item[0]}
                onClick={() =>
                  history.push(
                    `${match.url.split("/notifications/")[0]}/notifications/${
                      item[0]
                    }`
                  )
                }
              >
                {item[0]}
              </Menu.Item>
            ))}
        </Menu>
        <hr />
        <Button icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Add category
        </Button>
      </Layout.Sider>
      <Layout.Content>
        <NotificationList category={category} />
      </Layout.Content>
    </Layout>
  );
};

Notifications.propTypes = {
  schemaConfig: PropTypes.object,
  pathname: PropTypes.string,
};

export default Notifications;
