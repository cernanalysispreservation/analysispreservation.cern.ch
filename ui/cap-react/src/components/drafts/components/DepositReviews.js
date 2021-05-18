import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

import ReviewModal from "../../partials/Review/ReviewModal";
import ReviewList from "../../partials/Review/ReviewList";

class DepositReviews extends React.Component {
  constructor() {
    super();
  }

  render() {
    if (!this.props.review) return null;

    return (
      <Box margin={{ bottom: "medium" }}>
        <Box direction="row" wrap={false} justify="between" responsive={false}>
          <Heading tag="h3">Reviews</Heading>
          {this.props.canReview && <ReviewModal />}
        </Box>
        <ReviewList isReviewingPublished={this.props.isReviewingPublished} />
      </Box>
    );
  }
}

DepositReviews.propTypes = {
  canReview: PropTypes.bool,
  review: PropTypes.object,
  hideTitle: PropTypes.bool,
  isReviewingPublished: PropTypes.bool
};

function mapStateToProps(state, props) {
  return {
    review: props.isReviewingPublished
      ? state.published.get("review")
      : state.draftItem.get("review"),
    canReview: state.draftItem.get("can_review")
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositReviews);
