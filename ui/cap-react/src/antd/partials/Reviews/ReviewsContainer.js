import { connect } from "react-redux";
import Reviews from "./Reviews";
import { reviewDraft } from "../../../actions/draftItem";
import { reviewPublished } from "../../../actions/published";

const mapStateToProps = (state, props) => ({
  review: props.isReviewingPublished
    ? state.published.get("review")
    : state.draftItem.get("review"),
  canReview: props.isReviewingPublished
    ? null
    : state.draftItem.get("can_review"),
  draft_id: state.draftItem.get("id"),
  draftReviewLoading: state.draftItem.get("reviewLoading"),
  draftReviewError: state.draftItem.get("reviewError"),
  publishedReviewError: state.published.get("reviewError"),
  publishedReviewLoading: state.published.get("reviewLoading"),
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
)(Reviews);
