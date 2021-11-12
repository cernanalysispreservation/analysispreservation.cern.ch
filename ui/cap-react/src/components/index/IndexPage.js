import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import SearchPage from "../search/SearchPage";

// import Header from "../partials/Header";
import Header from "../../antd/partials/Header";

import Dashboard from "../dashboard/Dashboard";

import DraftsItemIndex from "../drafts/DraftsItemIndex";
import SettingsIndex from "../settings";
import CreateIndex from "../create";

import PublishedIndex from "../published/PublishedIndex";
import Footer from "../../antd/partials/Footer";
import ErrorPage from "../partials/ErrorPage";
import { Layout } from "antd";

import {
  HOME,
  DRAFTS,
  PUBLISHED,
  SETTINGS,
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
      <Layout className="__mainLayout__">
        <Layout.Header className="__mainHeader__">
          <Header />
        </Layout.Header>
        <Layout.Content>
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
        </Layout.Content>
        <Layout.Footer>
          <Footer />
        </Layout.Footer>
      </Layout>
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
