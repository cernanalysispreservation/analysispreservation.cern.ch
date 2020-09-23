import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "../../partials/Button";
import Heading from "grommet/components/Heading";

import { reviewDraft } from "../../../actions/draftItem";

import AddIcon from "grommet/components/icons/base/Add";

import DepositReviewItem from "./DepositReviewItem";

import { BsFillCircleFill } from "react-icons/bs";

import Modal from "../../partials/Modal";

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
        wrap={false}
        style={{
          background: this.state.reviewFormType === type ? "#E6F7FF" : "#f5f5f5"
        }}
      >
        <Box pad="small" align="center" justify="between" direction="row">
          <Heading tag="h4" margin="none">
            {title}
          </Heading>

          {this.state.reviewFormType === type && (
            <BsFillCircleFill color="#006A93" size={15} />
          )}
        </Box>
        <Box pad="small">
          <Box>{description}</Box>
        </Box>
      </Box>
    );
  }

  renderCreateLayer() {
    return (
      <Modal title="Add a review" onClose={this.toggleAddReview}>
        <Box flex={false} size="large" pad="medium">
          <Box pad={{ vertical: "medium" }}>
            <Box pad={{ between: "small" }}>
              <Box
                flex
                direction="row"
                justify="between"
                pad={{ between: "small" }}
              >
                {this.renderReviewTypeButton(
                  "approved",
                  "Approve",
                  "Submit feedback and approve the published version"
                )}
                {this.renderReviewTypeButton(
                  "request_changes",
                  "Request Changes",
                  "Submit feedback and request changes for the published version"
                )}
                {this.renderReviewTypeButton(
                  "declined",
                  "Decline",
                  "Submit feedback and decline the published version"
                )}
              </Box>
              <Box colorIndex="light-2">
                <textarea
                  placeholder="Leave a comment"
                  onChange={this.onReviewBodyChange}
                  rows="5"
                />
              </Box>
              {this.state.error && (
                <Box>
                  <span style={{ color: "red" }}>
                    Something went wrong while submitting the review
                  </span>
                  {this.state.error.errors.map((e, index) => (
                    <span key={index + e.field}>
                      - {e.field}: {e.message.join(", ")}
                    </span>
                  ))}
                </Box>
              )}
              <Box
                flex
                direction="row"
                justify="between"
                margin={{ top: "large" }}
              >
                <Button
                  text="Cancel"
                  onClick={this.toggleAddReview}
                  secondary
                />
                <Button
                  text="Add review"
                  disabled={
                    this.state.reviewFormType === null ||
                    this.state.reviewFormBody === null
                  }
                  primary
                  onClick={this.addReview}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  }

  render() {
    if (!this.props.review) return null;

    return (
      <Box margin={{ bottom: "medium" }} flex={false}>
        <Box
          flex={false}
          direction="row"
          wrap={false}
          justify="between"
          pad={this.props.heading && { vertical: "small" }}
        >
          {this.props.heading || <Heading tag="h3"> Reviews</Heading>}
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
        <Box
          flex={false}
          pad="small"
          colorIndex="light-2"
          margin={{ top: "small" }}
        >
          <Box flex={false} pad={{ between: "small" }}>
            {this.props.review && this.props.review.length > 0 ? (
              this.props.review.map((review, index) => (
                <DepositReviewItem
                  key={index + review.id}
                  draft_id={this.props.draft_id}
                  review={review}
                  reviewDraft={this.props.reviewDraft}
                />
              ))
            ) : (
              <Box align="center">No reviews submitted yet</Box>
            )}
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
  canAdmin: PropTypes.bool,
  reviewDraft: PropTypes.func,
  canReview: PropTypes.bool,
  review: PropTypes.object,
  hideTitle: PropTypes.bool
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
