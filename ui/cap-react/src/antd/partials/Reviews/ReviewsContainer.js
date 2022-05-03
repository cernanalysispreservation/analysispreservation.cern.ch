import { connect } from "react-redux";
import Reviews from "./Reviews";
import {
  clearDraftReviewErrors,
  reviewDraft
} from "../../../actions/draftItem";
import {
  reviewPublished,
  clearPublishedReviewErrors
} from "../../../actions/published";

const mapStateToProps = (state, props) => ({
  review: props.isReviewingPublished
    ? state.published.get("review")
    : state.draftItem.get("review"),
  canReview: props.isReviewingPublished
    ? state.published.get("can_review")
    : state.draftItem.get("can_review"),
  loading: props.isReviewingPublished
    ? state.published.get("reviewLoading")
    : state.draftItem.get("reviewLoading"),
  draft_id: state.draftItem.get("id"),
  error: props.isReviewingPublished
    ? state.published.get("reviewError")
    : state.draftItem.get("reviewError")
});

const mapDispatchToProps = (dispatch, props) => ({
  reviewDraft: (draft_id, review, message) =>
    dispatch(reviewDraft(draft_id, review, message)),
  reviewPublished: (review, message) =>
    dispatch(reviewPublished(review, message)),
  clearErrors: props.isReviewingPublished
    ? () => dispatch(clearPublishedReviewErrors())
    : () => dispatch(clearDraftReviewErrors())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reviews);
