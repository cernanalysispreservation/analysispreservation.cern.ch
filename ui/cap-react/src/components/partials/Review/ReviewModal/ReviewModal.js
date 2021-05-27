import React, { useState } from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Modal from "../../Modal";
import Button from "../../Button";

import ReviewOptions from "./ReviewOptions";

import { connect } from "react-redux";
import { reviewDraft } from "../../../../actions/draftItem";
import { reviewPublished } from "../../../../actions/published";

const ReviewModal = props => {
  const [reviewBody, setReviewBody] = useState(null);
  const [reviewType, setReviewType] = useState(null);
  const [showError, setShowError] = useState(false);

  return (
    <div>
      <Modal title="Add a review" onClose={props.onClose} disableCloseHandlers>
        <Box flex={false} size="large" pad="small">
          <Box pad={{ vertical: "medium" }}>
            <Box pad={{ between: "small" }}>
              <Box
                flex
                direction="row"
                justify="between"
                pad={{ between: "small" }}
              >
                <ReviewOptions
                  reviewType={reviewType}
                  updateReviewType={type => setReviewType(type)}
                />
              </Box>
              <Box colorIndex="light-2">
                <textarea
                  data-cy="add-review-comment"
                  placeholder="Leave a comment"
                  onChange={e => setReviewBody(e.target.value)}
                  rows="5"
                />
              </Box>
              {showError && (
                <Box style={{ color: "rgba(179, 53, 52, 1)" }}>
                  {props.isReviewingPublished
                    ? props.publishedReviewError &&
                      props.publishedReviewError.message
                    : props.draftReviewError && props.draftReviewError.message}
                </Box>
              )}
              <Box
                flex
                direction="row"
                justify="between"
                margin={{ top: "large" }}
                responsive={false}
              >
                <Button text="Cancel" onClick={props.onClose} secondary />
                <Button
                  dataCy="add-review"
                  text="Add review"
                  disabled={reviewType === null || reviewBody === null}
                  primary
                  loading={
                    props.isReviewingPublished
                      ? props.publishedReviewLoading
                      : props.draftReviewLoading
                  }
                  onClick={() => {
                    props.isReviewingPublished
                      ? props
                          .reviewPublished({
                            body: reviewBody,
                            type: reviewType
                          })
                          .then(response => {
                            response.error
                              ? setShowError(true)
                              : props.onClose();
                          })
                      : props
                          .reviewDraft(
                            props.draft_id,
                            {
                              body: reviewBody,
                              type: reviewType
                            },
                            "submitted"
                          )
                          .then(response => {
                            response.error
                              ? setShowError(true)
                              : props.onClose();
                          });
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

ReviewModal.propTypes = {
  onClose: PropTypes.func,
  isReviewingPublished: PropTypes.bool,
  publishedReviewError: PropTypes.object,
  draftReviewError: PropTypes.object,
  publishedReviewLoading: PropTypes.bool,
  draftReviewLoading: PropTypes.bool,
  draft_id: PropTypes.string,
  reviewDraft: PropTypes.func,
  reviewPublished: PropTypes.func
};

const mapStateToProps = state => ({
  draft_id: state.draftItem.get("id"),
  draftReviewLoading: state.draftItem.get("loading"),
  draftReviewError: state.draftItem.get("reviewError"),
  publishedReviewError: state.published.get("reviewError"),
  publishedReviewLoading: state.published.get("loading")
});

const mapDispatchToProps = dispatch => ({
  reviewDraft: (draft_id, review, message) =>
    dispatch(reviewDraft(draft_id, review, message)),
  reviewPublished: review => dispatch(reviewPublished(review, "submitted"))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewModal);
