import { permissionsPerUser } from "../utils";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Empty, Table, Tooltip, Typography } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import CollectionPermissionsColumn from "./CollectionPermissionsColumn";

const CollectionPermissions = ({ dont, permissions, editable, handlePermissions, defaultPermissions }) => {
  const [permissionsArray, setPermissionsArray] = useState([]);
  useEffect(() => {
    if (dont) {
      setPermissionsArray(permissions)
    }
    else if (permissions) {
      const { permissionsArray } = permissionsPerUser(permissions.toJS());
      setPermissionsArray(permissionsArray);
    }

    if (defaultPermissions) {
      const permissionsMap = {};
      let { permissionsArray: perms} = permissionsPerUser(defaultPermissions)
      for (const item of perms) {
        permissionsMap[item.email] = item.permissions;
      }

      const mergedArray = permissions.map((item) => ({
        ...item,
        permission: permissionsMap[item.email] || [],
        permissions: permissionsMap[item.email] || [],
      }));

      setPermissionsArray(mergedArray)
    }

  }, [permissions, defaultPermissions]);

  return permissionsArray && permissionsArray.length > 0 ? (
    <Table
      size="small"
      scroll={{x: true}}
      columns={[
        {
          title: "User",
          dataIndex: "email",
          key: "user",
          render: (e, item) => <Typography.Text >
           {item.type === "egroup" ? (
              <Tooltip title="egroup">
                <TeamOutlined />
              </Tooltip>
            ) : (
              <Tooltip title="user">
                <UserOutlined />
              </Tooltip>
            )}  {e} 
          </Typography.Text>
        },
        {
          title: "Read",
          dataIndex: "permissions",
          key: "read",
          align: "center",
          render: (e, item) => <CollectionPermissionsColumn e={e} item={item} type="read" editable={editable} handlePermissions={handlePermissions} />,
        },
        {
          title: "Create",
          dataIndex: "permissions",
          key: "create",
          align: "center",
          render: (e, item) => <CollectionPermissionsColumn e={e} item={item} type="create" editable={editable} handlePermissions={handlePermissions} />,
        },
        {
          title: "Review",
          dataIndex: "permissions",
          key: "review",
          align: "center",
          render: (e, item) => <CollectionPermissionsColumn e={e} item={item} type="review" editable={editable} handlePermissions={handlePermissions}/>,
        },
        {
          title: "Update",
          dataIndex: "permissions",
          key: "update",
          align: "center",
          render: (e, item) => <CollectionPermissionsColumn e={e} item={item} type="update" editable={editable} handlePermissions={handlePermissions}/>,
        },
        {
          title: "Admin",
          dataIndex: "permissions",
          key: "admin",
          align: "center",
          render: (e, item) => <CollectionPermissionsColumn e={e} item={item} type="admin" editable={editable} handlePermissions={handlePermissions}/>,
        }
      ]}
      dataSource={permissionsArray}
      fixedHeader
      pagination={{ pageSize: 5 }}
    />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description=" It seems that the author of the schema has not given permissions to anyone"
    />
  );
};

CollectionPermissions.propTypes = {
  permissions: PropTypes.object,
};

export default CollectionPermissions;
