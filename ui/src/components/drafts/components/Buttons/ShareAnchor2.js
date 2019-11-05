import React from "react";
import PropTypes from "prop-types";

import Button from "grommet/components/Button";
import Label from "grommet/components/Label";
import ShareIcon from "grommet/components/icons/base/Share";

const ShareAnchor2 = ({ action = null }) => {
  return (
    <Button
      icon={<ShareIcon size="xsmall" />}
      label={
        <Label size="small" uppercase={true}>
          Publish
        </Label>
      }
      onClick={action ? action : null}
    />
  );
};

ShareAnchor2.propTypes = {
  action: PropTypes.func
};

export default ShareAnchor2;
