import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "../../partials/Button";
import Heading from "grommet/components/Heading";

import { reviewDraft } from "../../../actions/draftItem";

import AddIcon from "grommet/components/icons/base/Add";
import { Layer } from "grommet";
import Status from "grommet/components/icons/Status";
import DepositReviewItem from "./DepositReviewItem";

class DepositReviews extends React.Component {
  constructor() {
    super();
    this.state = {
      addReviewLayer: false,
      reviewFormType: null,
      reviewFormBody: null
    };
  }

  toggleAddReview = () => {
    this.setState({
      addReviewLayer: !this.state.addReviewLayer,
      reviewFormType: null,
      reviewFormBody: null
    });
  };

  toggleActionBox = () => {
    this.setState({
      actionBoxActive: !this.state.addReviewLayer,
      reviewFormType: null,
      reviewFormBody: null
    });
  };

  addReview = () => {
    let review = {
      body: this.state.reviewFormBody,
      type: this.state.reviewFormType
    };

    this.setState({ error: null, loading: true });
    this.props.reviewDraft(this.props.draft_id, review).then(data => {
      if (data.type == "REVIEW_DRAFT_SUCCESS")
        this.setState({ addReviewLayer: false, loading: false });
      else if (data.type == "REVIEW_DRAFT_ERROR")
        this.setState({ error: data.error, loading: false });
    });
  };

  onReviewBodyChange = e => this.setState({ reviewFormBody: e.target.value });

  renderReviewTypeButton(type, title, description) {
    return (
      <Box
        onClick={() => this.setState({ reviewFormType: type })}
        flex
        colorIndex="light-2"
        align="start"
        justify="between"
        direction="row"
        wrap={false}
      >
        <Box pad="small">
          <Heading tag="h4">{title}</Heading>
          <Box pad="small">{description}</Box>
        </Box>
        <Box pad="small">
          <Status
            value={this.state.reviewFormType == type ? "ok" : "disabled"}
            sidze="small"
          />
        </Box>
      </Box>
    );
  }

  renderCreateLayer() {
    return (
      <Layer flush onClose={this.toggleAddReview} overlayClose>
        <Box pad="small">
          <Heading tag="h4">Add a review</Heading>
          <Box pad={{ between: "small" }}>
            <Box
              flex
              direction="row"
              justify="between"
              pad={{ between: "small" }}
            >
              {this.renderReviewTypeButton("approved", "Approve")}
              {this.renderReviewTypeButton(
                "request_changes",
                "Request Changes"
              )}
              {this.renderReviewTypeButton("declined", "Decline")}
            </Box>
            <Box colorIndex="light-2">
              <textarea
                placeholder="Leave a comment"
                onChange={this.onReviewBodyChange}
              />
            </Box>
            {this.state.error && (
              <Box>
                <span style={{ color: "red" }}>
                  Something went wrong while submitting the review
                </span>
                {this.state.error.errors.map(e => (
                  <span>
                    - {e.field}: {e.message.join(", ")}
                  </span>
                ))}
              </Box>
            )}
            <Box flex direction="row" justify="between">
              <Button
                text="Cancel"
                pad={{ horizontal: "small", vertical: "small" }}
                onClick={this.toggleAddReview}
              />
              <Button
                text="Add review"
                primary
                pad={{ horizontal: "small", vertical: "small" }}
                onClick={this.addReview}
              />
            </Box>
          </Box>
        </Box>
      </Layer>
    );
  }

  render() {
    if (!this.props.review) return null;

    return (
      <Box margin={{ bottom: "medium" }} flex={false}>
        <Box flex={false} direction="row" wrap={false} justify="between">
          <Heading tag="h3">Reviews</Heading>
          {this.props.canReview && (
            <Button
              text="Add Review"
              pad={{ horizontal: "small", vertical: "small" }}
              icon={<AddIcon size="xsmall" />}
              onClick={this.toggleAddReview}
            />
          )}
        </Box>
        {this.state.addReviewLayer ? this.renderCreateLayer() : null}

        <Box flex={false} pad="small" colorIndex="light-2">
          <Box flex={false} pad={{ between: "small" }}>
            {this.props.review &&
              this.props.review.map(review => (
                <DepositReviewItem
                  draft_id={this.props.draft_id}
                  review={review}
                  reviewDraft={this.props.reviewDraft}
                />
              ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

DepositReviews.propTypes = {
  match: PropTypes.object,
  getDraftById: PropTypes.func,
  loading: PropTypes.bool,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.object,
  handlePermissions: PropTypes.func,
  created_by: PropTypes.string,
  canAdmin: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    created_by: state.draftItem.get("created_by"),
    draft: state.draftItem.get("data"),
    permissions: state.draftItem.get("access"),
    review: state.draftItem.get("review"),
    loading: state.draftItem.get("loading"),
    canReview: state.draftItem.get("can_review")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    reviewDraft: (draft_id, review) => dispatch(reviewDraft(draft_id, review))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositReviews);
