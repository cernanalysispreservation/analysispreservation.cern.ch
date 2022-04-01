import React from "react";
import { Switch, Route } from "react-router-dom";

import ErrorPage from "../../components/partials/ErrorPage";
import OAuthConnect from "../../components/settings/components/OAuthConnect";
import SettingsIndex from "./Settings";

import DocumentTitle from "../partials/DocumentTitle";
import { SETTINGS, SETTINGS_AUTH_CONNECT } from "../routes";

const Settings = () => {
  return (
    <DocumentTitle title="Settings">
      <Switch>
        <Route exact path={SETTINGS} component={SettingsIndex} />
        <Route exact path={SETTINGS_AUTH_CONNECT} component={OAuthConnect} />
        <Route component={ErrorPage} />
      </Switch>
    </DocumentTitle>
  );
};

Settings.propTypes = {};

export default Settings;
