import { permissionsPerUser } from "../utils";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Empty, Table } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

const CollectionPermissions = ({ permissions }) => {
  const [permissionsArray, setPermissionsArray] = useState();

  useEffect(() => {
    const { permissionsArray } = permissionsPerUser(permissions);
    setPermissionsArray(permissionsArray);
  }, []);

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
          render: e => renderPermissionType(e, "deposit-read"),
        },
        {
          title: "Create",
          dataIndex: "permissions",
          key: "create",
          align: "center",
          render: e => renderPermissionType(e, "deposit-create"),
        },
        {
          title: "Review",
          dataIndex: "permissions",
          key: "review",
          align: "center",
          render: e => renderPermissionType(e, "deposit-review"),
        },
        {
          title: "Update",
          dataIndex: "permissions",
          key: "update",
          align: "center",
          render: e => renderPermissionType(e, "deposit-update"),
        },
        {
          title: "Admin",
          dataIndex: "permissions",
          key: "admin",
          align: "center",
          render: e => renderPermissionType(e, "deposit-admin"),
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
