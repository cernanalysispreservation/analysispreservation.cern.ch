import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import RefreshIcon from "grommet/components/icons/base/Refresh";

const DiscardAnchor = ({ action = null }) => {
  return (
    <Anchor
      label={
        <Label size="small" uppercase={true}>
          Discard
        </Label>
      }
      icon={<RefreshIcon size="xsmall" />}
      onClick={action ? action : null}
    />
  );
};

DiscardAnchor.propTypes = {
  action: PropTypes.func
};

export default DiscardAnchor;
