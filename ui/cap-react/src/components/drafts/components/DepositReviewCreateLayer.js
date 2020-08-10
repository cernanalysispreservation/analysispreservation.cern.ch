import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Button from "../../partials/Button";
import Heading from "grommet/components/Heading";
import Layer from "grommet/components/Layer";

import { BsFillCircleFill } from "react-icons/bs";

class DepositReviewCreateLayer extends React.Component {
  constructor() {
    super();
    this.state = {
      reviewFormType: null,
      reviewFormBody: null
    };
  }

  toggleAddReview = () => {
    this.setState({
      reviewFormType: null,
      reviewFormBody: null
    });
  };

  _addReview = () => {
    let review = {
      body: this.state.reviewFormBody,
      type: this.state.reviewFormType
    };

    this.props.addReview(review);
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

  render() {
    return (
      <Layer
        flush
        onClose={this.props.toggleAddReview}
        overlayClose
        closer={true}
      >
        <Box flex={false} size="large" pad="medium">
          <Heading tag="h3">Add a review</Heading>
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
                  pad={{ horizontal: "small", vertical: "small" }}
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
                  pad={{ horizontal: "small", vertical: "small" }}
                  onClick={
                    this.state.reviewFormType === null ||
                    this.state.reviewFormBody === null
                      ? null
                      : this._addReview
                  }
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Layer>
    );
  }
}

DepositReviewCreateLayer.propTypes = {
  toggleAddReview: PropTypes.func,
  addReview: PropTypes.func
};

export default DepositReviewCreateLayer;
