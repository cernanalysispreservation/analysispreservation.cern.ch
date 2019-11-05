import React from "react";
import PropTypes from "prop-types";

import TrashIcon from "grommet/components/icons/base/Trash";
import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";

const DeleteAnchor = ({ action = null }) => {
  return (
    <Anchor
      label={
        <Label size="small" uppercase={true}>
          Delete
        </Label>
      }
      icon={<TrashIcon size="xsmall" />}
      onClick={action ? action : null}
    />
  );
};

DeleteAnchor.propTypes = {
  action: PropTypes.func
};
export default DeleteAnchor;
