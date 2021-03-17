import React, { useState } from "react";
import PropTypes from "prop-types";

import RichEditorWidget from "./RichEditorWidget";
import RichEditorModal from "./RichEditorModal";

import Button from "../../../../../../partials/Button";

import { Box } from "grommet";

const RichEditorSelector = props => {
  const shouldDisplayEditorInModal =
    props.options && props.options.shouldDisplayEditorInModal;

  if (!shouldDisplayEditorInModal) return <RichEditorWidget {...props} />;

  const [displayModal, setDisplayModal] = useState(false);

  return (
    <Box align="center">
      <Button
        text="Show Markdown Editor"
        background="#e1e1e1"
        margin=" 5px 0"
        onClick={() => setDisplayModal(true)}
      />
      <RichEditorModal
        displayModal={displayModal}
        onClose={() => setDisplayModal(false)}
        displayedFromModal={shouldDisplayEditorInModal}
        {...props}
      />
    </Box>
  );
};

RichEditorSelector.propTypes = {
  options: PropTypes.object
};

export default RichEditorSelector;
