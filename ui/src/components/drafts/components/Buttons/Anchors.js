import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";

const Anchors = ({
  draft_id = draft_id,
  label = "",
  tab = "",
  icon = null
}) => {
  return (
    <Box pad={{ horizontal: "small" }} justify="end">
      <Anchor disabled={!tab} icon={icon} path={`/drafts/${draft_id}/${tab}`}>
        {label}
      </Anchor>
    </Box>
  );
};

Anchors.propTypes = {
  history: PropTypes.object,
  draft_id: PropTypes.string,
  tab: PropTypes.string,
  icon: PropTypes.node,
  label: PropTypes.string
};

export default Anchors;
