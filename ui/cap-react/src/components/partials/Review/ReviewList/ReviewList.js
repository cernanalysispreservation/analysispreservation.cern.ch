import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import { reviewDraft } from "../../../../actions/draftItem";
import { reviewPublished } from "../../../../actions/published";
import ReviewListItem from "../ReviewListItem";
import { AiOutlineInbox } from "react-icons/ai";

const ReviewList = ({
  review,
  draft_id,
  reviewDraft,
  draftLoading,
  reviewPublished,
  isReviewingPublished,
  shouldDisplayButtonsWhenFromPublished
}) => {
  return (
    <Box pad="small" colorIndex="light-1">
      <Box pad={{ between: "small" }}>
        {review && review.length > 0 ? (
          review.map((review, index) => (
            <ReviewListItem
              key={index + review.id}
              draft_id={draft_id}
              review={review}
              reviewDraft={reviewDraft}
              reviewPublished={reviewPublished}
              loading={draftLoading}
              isReviewingPublished={isReviewingPublished}
              shouldDisplayButtonsWhenFromPublished={
                shouldDisplayButtonsWhenFromPublished
              }
            />
          ))
        ) : (
          <Box align="center">
            <Box
              colorIndex="light-2"
              style={{
                borderRadius: "50%"
              }}
              pad="small"
              margin={{ bottom: "small" }}
            >
              <AiOutlineInbox size={25} />
            </Box>
            <Box align="center">No reviews submitted yet</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

ReviewList.propTypes = {
  review: PropTypes.array,
  draft_id: PropTypes.string,
  draftLoading: PropTypes.bool,
  reviewDraft: PropTypes.func,
  reviewPublished: PropTypes.func,
  isReviewingPublished: PropTypes.bool,
  shouldDisplayButtonsWhenFromPublished: PropTypes.bool
};

const mapStateToProps = (state, props) => ({
  review: props.isReviewingPublished
    ? state.published.get("review")
    : state.draftItem.get("review"),
  draft_id: state.draftItem.get("id"),
  draftLoading: state.draftItem.get("loading"),
  shouldDisplayButtonsWhenFromPublished:
    props.isReviewingPublished && state.published.get("can_review")
});

const mapDispatchToProps = dispatch => ({
  reviewDraft: (draft_id, review, message) =>
    dispatch(reviewDraft(draft_id, review, message)),
  reviewPublished: (review, message) =>
    dispatch(reviewPublished(review, message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewList);
