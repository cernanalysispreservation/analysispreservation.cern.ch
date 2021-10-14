import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../partials/Modal";
import ContextParams from "./utils/ContextParams";

const NotificationModal = ({ open, onClose, title, onChange, ctx, header }) => {
  return (
    open && (
      <Modal onClose={onClose} title={title} overflowVisible>
        <ContextParams
          onChange={onChange}
          onClose={onClose}
          header={header}
          ctx={ctx}
          modal
        />
      </Modal>
    )
  );
};

NotificationModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  onChange: PropTypes.func,
  ctx: PropTypes.object
};

export default NotificationModal;
