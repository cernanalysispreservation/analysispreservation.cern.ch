import { permissionsPerUser } from "../utils";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Empty, Table } from "antd";
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
    return e && e.includes(type) ? (
      <CheckOutlined style={{ color: "green" }} />
    ) : (
      <CloseOutlined style={{ color: "crimson" }} />
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
          title: "Read",
          dataIndex: "permissions",
          key: "read",
          align: "center",
          render: e => renderPermissionType(e, "deposit-schema-read"),
        },
        {
          title: "Create",
          dataIndex: "permissions",
          key: "create",
          align: "center",
          render: e => renderPermissionType(e, "deposit-schema-create"),
        },
        {
          title: "Review",
          dataIndex: "permissions",
          key: "review",
          align: "center",
          render: e => renderPermissionType(e, "deposit-schema-review"),
        },
        {
          title: "Update",
          dataIndex: "permissions",
          key: "update",
          align: "center",
          render: e => renderPermissionType(e, "deposit-schema-update"),
        },
        {
          title: "Admin",
          dataIndex: "permissions",
          key: "admin",
          align: "center",
          render: e => renderPermissionType(e, "deposit-schema-admin"),
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
