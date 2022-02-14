import React from "react";
import PropTypes from "prop-types";

import NoData from "../../img/nodata.svg";
import CollectionPermissionItem from "./CollectionPermissionItem";
import { Empty } from "antd";

const CollectionPermissions = ({ permissions }) => {
  if (!permissions || permissions.size == 0)
    return (
      <Empty
        image={<NoData />}
        description=" It seems that the author of the schema has not provided permissions to anyone."
      />
    );

  return (
    <div>
      <CollectionPermissionItem
        permissions={permissions.get("read")}
        title="Read"
      />
      <CollectionPermissionItem
        permissions={permissions.get("update")}
        title="Update"
      />
      <CollectionPermissionItem
        permissions={permissions.get("review")}
        title="Review"
      />
      <CollectionPermissionItem
        permissions={permissions.get("admin")}
        title="Admin"
      />
    </div>
  );
};

CollectionPermissions.propTypes = {
  permissions: PropTypes.object
};

export default CollectionPermissions;
