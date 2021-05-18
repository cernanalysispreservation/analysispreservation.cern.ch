import React from "react";
import PropTypes from "prop-types";
import DepositReviews from "../../drafts/components/DepositReviews";
import Modal from "../../partials/Modal";
import { Box } from "grommet";

const ModalReviews = ({ show, onClose, isReviewingPublished = false }) => {
  return (
    show && (
      <Modal separator onClose={onClose}>
        <Box size="xlarge">
          <DepositReviews isReviewingPublished={isReviewingPublished} />
        </Box>
      </Modal>
    )
  );
};

ModalReviews.propTypes = {
  isReviewingPublished: PropTypes.bool,
  show: PropTypes.bool,
  onClose: PropTypes.func
};

export default ModalReviews;
