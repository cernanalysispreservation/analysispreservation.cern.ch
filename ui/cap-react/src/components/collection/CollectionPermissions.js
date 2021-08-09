import React from "react";
import PropTypes from "prop-types";
import { Box, Label } from "grommet";
import NoData from "../../img/nodata.svg";
import CollectionPermissionItem from "./CollectionPermissionItem";

const CollectionPermissions = ({ permissions }) => {
  if (!permissions || permissions.size == 0)
    return (
      <Box colorIndex="light-2" pad="medium" align="center">
        <NoData />
        <Label align="center">
          It seems that the author of the schema has not provided permissions to
          anyone.
        </Label>
      </Box>
    );

  return (
    <Box>
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
    </Box>
  );
};

CollectionPermissions.propTypes = {
  permissions: PropTypes.object
};

export default CollectionPermissions;
