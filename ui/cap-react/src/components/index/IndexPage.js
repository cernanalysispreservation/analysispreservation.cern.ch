import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import SearchPage from "../search/SearchPage";

import Header from "../partials/Header";

import Dashboard from "../dashboard/Dashboard";

import DraftsItemIndex from "../drafts/DraftsItemIndex";
import SettingsIndex from "../settings";
import WorkflowsIndex from "../workflows";
import CreateIndex from "../create";

import PublishedIndex from "../published/PublishedIndex";
import GrommetFooter from "../footer/Footer";
import NotFoundPage from "../errors/404";

import {
  HOME,
  DRAFTS,
  PUBLISHED,
  SETTINGS,
  WORKFLOWS,
  CREATE_INDEX,
  SEARCH,
  DRAFT_ITEM
} from "../routes";

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
            <Route path={DRAFT_ITEM} component={DraftsItemIndex} />
            <Route exact path={HOME} component={Dashboard} />
            <Route path={SEARCH} component={SearchPage} />
            <Route exact path={DRAFTS} component={SearchPage} />
            <Route path={PUBLISHED} component={PublishedIndex} />
            <Route path={SETTINGS} component={SettingsIndex} />
            <Route path={WORKFLOWS} component={WorkflowsIndex} />
            <Route path={CREATE_INDEX} component={CreateIndex} />
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
