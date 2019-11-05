import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import ShareIcon from "grommet/components/icons/base/Share";

const SettingsAnchor = ({ history, draft_id = draft_id }) => {
  return (
    <Anchor
      icon={<ShareIcon size="xsmall" />}
      label={
        <Label size="small" uppercase={true}>
          Access
        </Label>
      }
      onClick={() => history.push(`/drafts/${draft_id}/settings`)}
    />
  );
};

SettingsAnchor.propTypes = {
  history: PropTypes.object,
  draft_id: PropTypes.string
};

export default withRouter(SettingsAnchor);
