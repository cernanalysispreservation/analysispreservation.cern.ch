import { permissionsPerUser } from "../utils";
import { CloseOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Empty, Space, Table, Tag, Tooltip } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CollectionPermissions = ({ permissions }) => {
  const [permissionsArray, setPermissionsArray] = useState();

  useEffect(() => {
    if (permissions) {
      const { permissionsArray } = permissionsPerUser(permissions.toJS());
      setPermissionsArray(permissionsArray);
    }
  }, [permissions]);

  const renderPermissionType = (e, type) => {
    let tags = [];
    if (e.includes(`deposit-schema-${type}`)) {
      tags.push(
        <Tooltip title="Drafts">
          <Tag color="geekblue" style={{ marginRight: 0 }}>
            D
          </Tag>
        </Tooltip>
      );
    }
    if (e.includes(`record-schema-${type}`)) {
      tags.push(
        <Tooltip title="Published">
          <Tag color="purple" style={{ marginRight: 0 }}>
            P
          </Tag>
        </Tooltip>
      );
    }
    return tags.length ? (
      <Space>{tags}</Space>
    ) : (
      <CloseOutlined style={{ color: "lightgray" }} />
    );
  };

  return permissionsArray && permissionsArray.length > 0 ? (
    <Table
      columns={[
        {
          title: "User",
          dataIndex: "email",
          key: "user",
        },
        {
          title: "Type",
          dataIndex: "type",
          key: "type",
          align: "center",
          render: e =>
            e === "egroup" ? (
              <Tooltip title="egroup">
                <TeamOutlined />
              </Tooltip>
            ) : (
              <Tooltip title="user">
                <UserOutlined />
              </Tooltip>
            ),
        },
        {
          title: "Read",
          dataIndex: "permissions",
          key: "read",
          align: "center",
          render: e => renderPermissionType(e, "read"),
        },
        {
          title: "Create",
          dataIndex: "permissions",
          key: "create",
          align: "center",
          render: e => renderPermissionType(e, "create"),
        },
        {
          title: "Review",
          dataIndex: "permissions",
          key: "review",
          align: "center",
          render: e => renderPermissionType(e, "review"),
        },
        {
          title: "Update",
          dataIndex: "permissions",
          key: "update",
          align: "center",
          render: e => renderPermissionType(e, "update"),
        },
        {
          title: "Admin",
          dataIndex: "permissions",
          key: "admin",
          align: "center",
          render: e => renderPermissionType(e, "admin"),
        },
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
