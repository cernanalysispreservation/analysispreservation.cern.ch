import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";
import Anchor from "grommet/components/Anchor";
import Edit from "grommet/components/icons/base/Edit";

const EditAnchor = ({ draft_id = draft_id, icon = false }) => {
  return (
    <Box pad={{ horizontal: "small" }} justify="end">
      <Anchor
        icon={icon ? <Edit size="xsmall" /> : null}
        path={`/drafts/${draft_id}/edit`}
        primary={icon}
        label={
          icon ? (
            <Label size="small" uppercase={icon}>
              Edit
            </Label>
          ) : (
            "Edit"
          )
        }
      />
    </Box>
  );
};

EditAnchor.propTypes = {
  history: PropTypes.object,
  draft_id: PropTypes.string,
  icon: PropTypes.bool
};

export default EditAnchor;
