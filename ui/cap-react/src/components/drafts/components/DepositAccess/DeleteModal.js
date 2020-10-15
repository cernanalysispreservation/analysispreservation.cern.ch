import React from "react";
import PropTypes from "prop-types";
import Modal from "../../../partials/Modal";
import Button from "../../../partials/Button";
import { Paragraph, Box } from "grommet";

const DeleteModal = ({ open, onClose, onDelete }) => {
  return (
    open && (
      <Modal onClose={onClose} title="Delete User" separator>
        <Box pad="medium">
          <Paragraph>
            Do you want to <b>permantly</b> delete {open}?
          </Paragraph>
          <Box
            margin={{ top: "medium" }}
            direction="row"
            justify="between"
            responsive={false}
          >
            <Button text="Cancel" onClick={onClose} />
            <Button text="Delete" critical onClick={onDelete} />
          </Box>
        </Box>
      </Modal>
    )
  );
};

DeleteModal.propTypes = {
  open: PropTypes.string,
  onClose: PropTypes.func,
  onDelete: PropTypes.func
};

export default DeleteModal;
