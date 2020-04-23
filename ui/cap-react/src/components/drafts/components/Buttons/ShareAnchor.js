import React from "react";
import PropTypes from "prop-types";
import Anchor from "grommet/components/Anchor";
import AnnounceIcon from "grommet/components/icons/base/Announce";

import Label from "grommet/components/Label";

const ShareAnchor = ({ action = null }) => {
  return (
    <Anchor
      icon={<AnnounceIcon size="xsmall" />}
      label={
        <Label size="small" uppercase={true}>
          Publish
        </Label>
      }
      onClick={action ? action : null}
    />
  );
};

ShareAnchor.propTypes = {
  action: PropTypes.func
};

export default ShareAnchor;
