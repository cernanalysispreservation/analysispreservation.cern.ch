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
        <Box colorIndex="light-1" pad="medium">
          <Box align="center" margin={{ top: "small" }}>
            <Paragraph margin="none">
              It seems that you have unsaved updated data in your draft
            </Paragraph>
            <Box margin={{ top: "small" }}>
              <Paragraph margin="none">
                Are you sure you want to leave this page without saving?
              </Paragraph>
            </Box>
          </Box>
          <Box
            direction="row"
            flex={true}
            pad={{ between: "medium" }}
            justify="between"
            align="center"
            responsive={false}
            margin={{ top: "large" }}
          >
            <Button text="Cancel" primary onClick={onCancel} />
            <Button text="Exit without saving" onClick={onConfirm} tertiary />
          </Box>
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
