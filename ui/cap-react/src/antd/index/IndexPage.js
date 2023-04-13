import React from "react";
import { Switch, Route } from "react-router-dom";

import SearchPage from "../search";

import Dashboard from "../dashboard";

import SettingsIndex from "../settings";
import DraftsItemIndex from "../drafts";

import CreateIndex from "../create";

import PublishedIndex from "../published";

import CollectionPage from "../collection";
import ErrorPage from "../partials/Error";

import {
  HOME,
  DRAFTS,
  PUBLISHED,
  SETTINGS,
  CREATE_INDEX,
  SEARCH,
  DRAFT_ITEM,
  COLLECTION,
} from "../routes";

const IndexPage = () => {
  return (
    <Switch>
      <Route path={DRAFT_ITEM} component={DraftsItemIndex} />
      <Route exact path={HOME} component={Dashboard} />
      <Route path={SEARCH} component={SearchPage} />
      <Route exact path={DRAFTS} component={SearchPage} />
      <Route path={PUBLISHED} component={PublishedIndex} />
      <Route path={SETTINGS} component={SettingsIndex} />
      <Route path={CREATE_INDEX} component={CreateIndex} />
      <Route path={COLLECTION} component={CollectionPage} />
      <Route component={ErrorPage} />
    </Switch>
  );
};

export default IndexPage;
