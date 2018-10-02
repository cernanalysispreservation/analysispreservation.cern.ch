import PropTypes from "prop-types";

import React from "react";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import AvailableDeposits from "./AvailableDeposits";
import CreateDeposit from "./CreateDeposit";
import DepositSettings from "./components/DepositSettings";
import DraftPreview from "./DraftPreview";

import { Switch, Route } from "react-router-dom";
import { withRouter } from "react-router";

class DraftsIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true}>
        <Switch>
          <Route exact path="/drafts/create" component={AvailableDeposits} />
          <Route path={`/drafts/create/:schema_id`} component={CreateDeposit} />
          <Route exact path={`/drafts/:draft_id`} component={DraftPreview} />
          <Route path={`/drafts/:draft_id/edit`} component={CreateDeposit} />
          <Route
            path={`/drafts/:draft_id/settings`}
            component={DepositSettings}
          />
        </Switch>
      </Box>
    );
  }
}

DraftsIndex.propTypes = {
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
  )(DraftsIndex)
);
