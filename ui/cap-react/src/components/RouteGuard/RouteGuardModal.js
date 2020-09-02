import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";

import Button from "../partials/Button";
import Modal from "../partials/Modal";

const RouteGuardModal = ({ show, onCancel, onConfirm }) => {
  if (show) {
    return (
      <Modal
        onClose={onCancel}
        title="Do you want to exit without saving?"
        tag="h6"
        separator
      >
        <Box
          colorIndex="light-1"
          pad={{ horizontal: "large", vertical: "small" }}
          align="center"
        >
          <Paragraph margin="none">You draft has unsaved changes</Paragraph>
        </Box>
        <Box
          direction="row"
          flex={true}
          pad={{ between: "medium" }}
          justify="around"
          align="center"
          responsive={false}
          margin={{ top: "large" }}
        >
          <Button text="Cancel" primary onClick={onCancel} />
          <Button text="Exit" onClick={onConfirm} secondary />
        </Box>
      </Modal>
    );
  } else {
    return null;
  }
};

RouteGuardModal.propTypes = {
  show: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default RouteGuardModal;
