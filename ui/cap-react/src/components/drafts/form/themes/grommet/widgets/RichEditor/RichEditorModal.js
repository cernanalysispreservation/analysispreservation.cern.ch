import React from "react";
import PropTypes from "prop-types";

import Modal from "../../../../../../partials/Modal";
import RichEditorWidget from "./RichEditorWidget";

const RichEditorModal = props => {
  return (
    props.displayModal && (
      <Modal onClose={props.onClose} title={props.label || null} separator>
        <RichEditorWidget {...props} />
      </Modal>
    )
  );
};

RichEditorModal.propTypes = {
  displayModal: PropTypes.bool
};

export default RichEditorModal;
