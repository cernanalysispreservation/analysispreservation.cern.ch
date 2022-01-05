import React from "react";
import PropTypes from "prop-types";
import { Switch, Route } from "react-router-dom";

import SearchPage from "../../components/search/SearchPage";

import Dashboard from "../dashboard";

import SettingsIndex from "../settings";
import DraftsItemIndex from "../drafts";

import CreateIndex from "../create";

import PublishedIndex from "../../components/published/PublishedIndex";
import ErrorPage from "../../components/partials/ErrorPage";

import {
  HOME,
  DRAFTS,
  PUBLISHED,
  SETTINGS,
  CREATE_INDEX,
  SEARCH,
  DRAFT_ITEM
} from "../../components/routes";

class IndexPage extends React.Component {
  render() {
    return (
      <Switch>
        <Route path={DRAFT_ITEM} component={DraftsItemIndex} />
        <Route exact path={HOME} component={Dashboard} />
        <Route path={SEARCH} component={SearchPage} />
        <Route exact path={DRAFTS} component={SearchPage} />
        <Route path={PUBLISHED} component={PublishedIndex} />
        <Route path={SETTINGS} component={SettingsIndex} />
        <Route path={CREATE_INDEX} component={CreateIndex} />
        <Route component={ErrorPage} />
      </Switch>
    );
  }
}

IndexPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object
};

export default IndexPage;
