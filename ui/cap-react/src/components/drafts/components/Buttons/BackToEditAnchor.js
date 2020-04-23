import React from "react";
import PropTypes from "prop-types";

import Anchor from "grommet/components/Anchor";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";

import { withRouter } from "react-router";

const BackToEditAnchor = ({ history, draft_id = null }) => {
  return (
    <Anchor
      icon={<LinkPreviousIcon />}
      onClick={() => history.push(`/drafts/${draft_id}/edit`)}
    />
  );
};

BackToEditAnchor.propTypes = {
  history: PropTypes.object,
  draft_id: PropTypes.string
};

export default withRouter(BackToEditAnchor);
