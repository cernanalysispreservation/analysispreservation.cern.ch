import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Layout, Menu, Typography } from "antd";
import NotificationList from "../containers/NotificationList";
import { CMS_NOTIFICATION } from "../../../../components/routes";

const Notifications = ({ schemaConfig, pathname, match, history }) => {
  useEffect(() => {
    let values = [];
    schemaConfig && schemaConfig.mapKeys(key => values.push(key));
    if (match.path == CMS_NOTIFICATION) {
      history.push(pathname + "/" + values[0]);
    }
  }, []);

  const { category } = match.params;

  return (
    <Layout style={{ height: "100%", padding: 0 }}>
      <Layout.Sider>
        <Typography.Title
          level={5}
          style={{ color: "#fff", textAlign: "center" }}
        >
          Notifications
        </Typography.Title>
        <Menu selectable selectedKeys={category} theme="dark">
          {schemaConfig &&
            schemaConfig.entrySeq().map(item => (
              <Menu.Item
                key={item[0]}
                onClick={() =>
                  history.push(pathname.split(category)[0] + item[0])
                }
              >
                {item[0]}
              </Menu.Item>
            ))}
        </Menu>
      </Layout.Sider>
      <Layout.Content>
        <NotificationList category={category} />
      </Layout.Content>
    </Layout>
  );
};

Notifications.propTypes = {
  schemaConfig: PropTypes.object,
  pathname: PropTypes.string
};

export default Notifications;
