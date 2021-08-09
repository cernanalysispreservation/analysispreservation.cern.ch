import React from "react";
import PropTypes from "prop-types";
import { Box, Label, Heading } from "grommet";
import Tag from "../partials/Tag";

const CollectionPermissionItem = ({ permissions, title }) => {
  return (
    <Box colorIndex="light-2" pad="small" margin={{ bottom: "medium" }}>
      <Heading tag="h6">{title}</Heading>
      <Box direction="row" wrap align="center">
        {permissions && permissions.size > 0 ? (
          permissions.map((item, index) => (
            <Tag text={item} margin="5px" key={item + index} />
          ))
        ) : (
          <Label margin="none" size="small">
            There are not egroups/users email addresses provided for this
            category
          </Label>
        )}
      </Box>
    </Box>
  );
};

CollectionPermissionItem.propTypes = {
  permissions: PropTypes.array,
  title: PropTypes.string
};

export default CollectionPermissionItem;
