import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import SaveIcon from "grommet/components/icons/base/Save";
import Label from "grommet/components/Label";

const SaveAnchor = ({ action = null }) => {
  return (
    <Anchor
      icon={<SaveIcon size="xsmall" />}
      primary={true}
      label={
        <Label size="small" uppercase={true}>
          Save
        </Label>
      }
      onClick={action ? action : null}
    />
  );
};

SaveAnchor.propTypes = {
  action: PropTypes.func
};

export default SaveAnchor;
