import React, { useState } from "react";
import PropTypes from "prop-types";

import Button from "../../Button";
import { AiOutlinePlus } from "react-icons/ai";
import ReviewModal from "./ReviewModal";

const Review = props => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <Button
        text="Add Review"
        icon={<AiOutlinePlus size={15} />}
        onClick={() => setShowModal(true)}
        {...props.buttonProps}
      />

      {showModal && (
        <ReviewModal
          onClose={() => setShowModal(false)}
          isReviewingPublished={props.isReviewingPublished}
        />
      )}
    </div>
  );
};

Review.propTypes = {
  buttonProps: PropTypes.object,
  isReviewingPublished: PropTypes.bool
};

export default Review;
