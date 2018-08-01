import PropTypes from "prop-types";

import React from "react";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import AvailableDeposits from "./AvailableDeposits";
import CreateDeposit from "./CreateDeposit";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";

class CreateIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true} justify="center" align="center">
        <Route path="/" component={AvailableDeposits} />
        <Route path={`/create/:schema_id`} component={CreateDeposit} />
      </Box>
    );
  }
}

CreateIndex.propTypes = {
  startDeposit: PropTypes.func
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

function mapDispatchToProps() {
  return {};
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateIndex)
);
