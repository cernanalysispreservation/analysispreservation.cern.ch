import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "../../partials/Button";
import Heading from "grommet/components/Heading";

import { AiOutlineCheck, AiOutlineDelete } from "react-icons/ai";
import ShowMoreText from "../../partials/ShowMoreText";

import Tag from "../../partials/Tag";

class DepositReviewItem extends React.Component {
  constructor() {
    super();
    this.state = {
      actionBoxActive: false,
      action: null,
      reviewFormComment: ""
    };
  }

  postReviewAction = type => {
    let review = {
      comment: this.state.reviewFormComment,
      action: type,
      id: this.props.review.id
    };

    this.setState({ error: null, loading: true });
    this.props.reviewDraft(this.props.draft_id, review).then(data => {
      if (data.type == "REVIEW_DRAFT_SUCCESS")
        this.setState({ addReviewLayer: false, loading: false });
      else if (data.type == "REVIEW_DRAFT_ERROR")
        this.setState({ error: data.error, loading: false });
    });
  };

  addComment = () => {
    let review = {
      comment: this.state.reviewFormComment,
      action: "comment"
    };

    this.setState({ error: null, loading: true });
    this.props.reviewDraft(this.props.draft_id, review).then(data => {
      if (data.type == "REVIEW_DRAFT_SUCCESS")
        this.setState({ addReviewLayer: false, loading: false });
      else if (data.type == "REVIEW_DRAFT_ERROR")
        this.setState({ error: data.error, loading: false });
    });
  };

  onReviewCommentChange = e =>
    this.setState({ reviewFormComment: e.target.value });

  renderReviewTypeHeading = type => {
    const _types = {
      approved: "Approved",
      request_changes: "Changes Requested",
      declined: "Declined"
    };
    return <span>{_types[type]}</span>;
  };

  renderActionBox() {
    return (
      <Box pad={{ vertical: "small" }}>
        <Box pad={{ between: "small" }}>
          <Box colorIndex="light-1">
            <textarea
              placeholder="Leave a comment"
              onChange={this.onReviewCommentChange}
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
          <Box pad={{ between: "small" }} flex direction="row" justify="end">
            <Button
              secondary
              text={
                !this.state.reviewFormComment ||
                this.state.reviewFormComment == ""
                  ? "Resolve"
                  : "Comment & Resolve"
              }
              pad={{ horizontal: "small", vertical: "small" }}
              onClick={this.toggleAddReview}
            />
            <Button
              text="Comment"
              primary
              pad={{ horizontal: "small", vertical: "small" }}
              onClick={this.addReview}
            />
          </Box>
        </Box>
      </Box>
    );
  }

  render() {
    let { review } = this.props;
    return (
      <Box flex key={review.id}>
        <Box
          wrap={false}
          colorIndex="light-1"
          pad={{ horizontal: "small", vertical: "small", between: "small" }}
        >
          <Box flex={true}>
            <Box direction="row" responsive={false}>
              <Heading tag="h5" margin={review.resolved ? "none" : null}>
                {this.renderReviewTypeHeading(review.type)} by{" "}
                <a href={`mailto:${review.reviewer}`}>{review.reviewer}</a>
              </Heading>
              {review.resolved && (
                <Box margin={{ left: "small" }}>
                  <Tag
                    text="Resolved"
                    color={{
                      bgcolor: "#e6ffed",
                      border: "#e6ffed",
                      color: "#457352"
                    }}
                  />
                </Box>
              )}
            </Box>
            {!this.state.bodyEnabled && (
              <Box
                colorIndex={review.resolved ? "light-1" : "light-2"}
                style={{
                  fontStyle: review.resolved ? "italic" : "normal"
                }}
                pad={{ horizontal: "small" }}
                margin={{ top: "small" }}
              >
                <Box
                  margin="small"
                  style={{
                    margin: "12px 0",
                    maxWidth: "100%",
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: 1.375
                  }}
                >
                  <ShowMoreText lines={10} more="Show More" less="Show less">
                    {review.body}
                  </ShowMoreText>
                </Box>
              </Box>
            )}
          </Box>
          {!review.resolved && (
            <Box
              direction="row"
              justify="between"
              margin={{ top: "small" }}
              responsive={false}
            >
              {/* <Button
                key="Comment"
                text="Comment"
                separator="all"
                pad={{ horizontal: "small", vertical: null }}
                icon={<IterationIcon size="xsmall" />}
                onClick={() => this.postReviewAction("comment")}
              /> */}
              <Button
                key="Delete"
                text="Delete"
                secondary
                icon={<AiOutlineDelete size={15} />}
                onClick={() => this.postReviewAction("delete")}
              />
              <Button
                key="Resolve"
                text="Resolve"
                secondary
                icon={<AiOutlineCheck size={15} />}
                onClick={() => this.postReviewAction("resolve")}
              />
            </Box>
          )}
          <Box flex={true} style={overlayStyles} />
        </Box>
        {this.state.actionBoxActive && this.renderActionBox()}
      </Box>
    );
  }
}

const overlayStyles = {
  // width: "100%",
  // height: "100%",
  position: "absolute",
  zIndex: 1000,
  backgroundColor: "red"
};
DepositReviewItem.propTypes = {
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
  review: PropTypes.object
};

export default DepositReviewItem;
