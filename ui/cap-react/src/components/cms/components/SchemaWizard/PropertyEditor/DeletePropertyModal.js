import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../../partials/Modal";
import Button from "../../../../partials/Button";
import Box from "grommet/components/Box";
import Paragraph from "grommet/components/Paragraph";

const DeletePropertyModal = ({ show, text, onClose, onDelete }) => {
  return (
    show && (
      <Modal title="Delete Item" separator onClose={onClose}>
        <Box pad={{ vertical: "medium", horizontal: "small" }}>
          <Box align="center" justify="center" colorIndex="light-1">
            <Paragraph margin="none">Are you sure you want to delete</Paragraph>
            <Paragraph margin="none">{text}</Paragraph>
          </Box>

          <Box margin={{ top: "medium" }} direction="row" justify="between">
            <Button text="Cancel" secondary onClick={onClose} />
            <Button text="Delete" critical onClick={onDelete} />
          </Box>
        </Box>
      </Modal>
    )
  );
};

DeletePropertyModal.propTypes = {
  show: PropTypes.bool,
  text: PropTypes.string,
  onClose: PropTypes.func,
  onDelete: PropTypes.func
};

export default DeletePropertyModal;
