import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Box from "grommet/components/Box";
import { reviewDraft } from "../../../../actions/draftItem";
import ReviewListItem from "../ReviewListItem";
import { AiOutlineInbox } from "react-icons/ai";

const ReviewList = ({ review, draft_id, reviewDraft, draftLoading }) => {
  return (
    <Box pad="small" colorIndex="light-2" margin={{ top: "small" }}>
      <Box pad={{ between: "small" }}>
        {review && review.length > 0 ? (
          review.map((review, index) => (
            <ReviewListItem
              key={index + review.id}
              draft_id={draft_id}
              review={review}
              reviewDraft={reviewDraft}
              loading={draftLoading}
            />
          ))
        ) : (
          <Box align="center">
            <Box
              colorIndex="light-1"
              style={{
                padding: "10px",
                borderRadius: "50%"
              }}
              margin={{ bottom: "small" }}
            >
              <AiOutlineInbox size={18} />
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
  draftLoading: PropTypes.bool
};

const mapStateToProps = state => ({
  review: state.draftItem.get("review"),
  draft_id: state.draftItem.get("id"),
  draftLoading: state.draftItem.get("loading")
});

const mapDispatchToProps = dispatch => ({
  reviewDraft: (draft_id, review, message) =>
    dispatch(reviewDraft(draft_id, review, message))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewList);
