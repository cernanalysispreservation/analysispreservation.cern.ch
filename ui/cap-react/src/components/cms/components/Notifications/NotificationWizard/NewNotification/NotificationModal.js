import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../../../../../partials/Modal";
import { Box, Heading, Label } from "grommet";
import Button from "../../../../../partials/Button";
import Select from "react-select";
import AddParameterManually from "./utils/AddParameterManually";
import { getMethodsByType } from "./utils/customMethds";
import ContextParams from "./utils/ContextParams";

const NotificationModal = ({ open, onClose, title, onChange, ctx, header }) => {
  const [selectedValue, setSelectedValue] = useState(null);
  const selectedOptions = ctx
    .map(item => (item.has("method") ? item.get("method") : null))
    .filter(item => item != undefined);

  const allowedMethods = getMethodsByType(header).filter(
    item => !selectedOptions.includes(item.value)
  );

  return (
    open && (
      <Modal onClose={onClose} title={title} overflowVisible>
        <ContextParams
          allowedMethods={allowedMethods}
          onChange={onChange}
          onClose={onClose}
          header={header}
          ctx={ctx}
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
