import React from "react";
import PropTypes from "prop-types";

import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";

import SettingsIndex from "./Settings";
import NotFoundPage from "../errors/404";
import OAuthConnect from "./components/OAuthConnect";

import DocumentTitle from "../partials/Title";
class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <DocumentTitle title="Settings">
        <Switch>
          <Route exact path="/settings" component={SettingsIndex} />
          <Route exact path="/settings/auth/connect" component={OAuthConnect} />
          <Route component={NotFoundPage} />
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
