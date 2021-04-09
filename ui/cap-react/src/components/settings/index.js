import React from "react";
import PropTypes from "prop-types";

import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";

import SettingsIndex from "./Settings";
import ErrorPage from "../partials/ErrorPage";
import OAuthConnect from "./components/OAuthConnect";

import DocumentTitle from "../partials/Title";
import { SETTINGS, SETTINGS_AUTH_CONNECT } from "../routes";
class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="Settings">
        <Switch>
          <Route exact path={SETTINGS} component={SettingsIndex} />
          <Route exact path={SETTINGS_AUTH_CONNECT} component={OAuthConnect} />
          <Route component={ErrorPage} />
        </Switch>
      </DocumentTitle>
    );
  }
}

IndexPage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default withRouter(IndexPage);
