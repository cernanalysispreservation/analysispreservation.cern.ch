import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";
import Edit from "grommet/components/icons/base/Edit";

const EditAnchor = ({ history, draft_id = draft_id }) => {
  return (
    <Box pad={{ horizontal: "small" }}>
      <Anchor
        icon={<Edit size="xsmall" />}
        primary={true}
        label={
          <Label size="small" uppercase={true}>
            Edit
          </Label>
        }
        onClick={() => history.push(`/drafts/${draft_id}/edit`)}
      />
    </Box>
  );
};

EditAnchor.propTypes = {
  history: PropTypes.object,
  draft_id: PropTypes.string
};

export default withRouter(EditAnchor);
