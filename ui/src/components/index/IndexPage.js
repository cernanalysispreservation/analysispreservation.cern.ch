import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";
import {
  SearchPage,
  DraftsItemIndex,
  PublishedIndex,
  SettingsIndex,
  WorklflowsIndex,
  NotFoundPage
} from "../Routes";

import Box from "grommet/components/Box";
import Header from "../partials/Header";

import Dashboard from "../dashboard/Dashboard";

import GrommetFooter from "../footer/Footer";

import {
  SEARCH,
  DRAFT,
  WORKFLOWS,
  DRAFT_ITEM,
  PUBLISHED,
  HOME,
  SETTINGS
} from "../Routes/paths";

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box flex={true}>
        <Header />
        <Box flex={true}>
          <Switch>
            <Route exact path={HOME} component={Dashboard} />
            <Route exact path={SEARCH} component={SearchPage} />
            <Route exact path={DRAFT} component={SearchPage} />
            <Route path={DRAFT_ITEM} component={DraftsItemIndex} />
            <Route path={PUBLISHED} component={PublishedIndex} />
            <Route path={SETTINGS} component={SettingsIndex} />
            <Route path={WORKFLOWS} component={WorklflowsIndex} />
            <Route component={NotFoundPage} />
          </Switch>
        </Box>
        <GrommetFooter />
      </Box>
    );
  }
}

IndexPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get("isLoggedIn")
  };
}

export default withRouter(connect(mapStateToProps)(IndexPage));
