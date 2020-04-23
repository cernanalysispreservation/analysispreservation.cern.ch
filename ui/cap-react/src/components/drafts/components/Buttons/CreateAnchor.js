import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import SaveIcon from "grommet/components/icons/base/Save";
import Label from "grommet/components/Label";

const CreateAnchor = ({ onClick = null }) => {
  return (
    <Anchor
      icon={<SaveIcon size="xsmall" />}
      label={
        <Label size="small" uppercase={true}>
          Save & Continue
        </Label>
      }
      onClick={onClick}
    />
  );
};

CreateAnchor.propTypes = {
  onClick: PropTypes.func
};

export default CreateAnchor;
