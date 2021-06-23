import React from "react";
import PropTypes from "prop-types";

import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import CMSIndex from "./components/CMSIndex";
import AdminIndex from "./containers/AdminIndex";

import DocumentTitle from "../partials/Title";
import { CMS, CMS_SCHEMA_PATH } from "../routes";

class IndexPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <DocumentTitle title="Admin Page">
          <Switch>
            <Route path={CMS} exact component={CMSIndex} />
            <Route path={CMS_SCHEMA_PATH} component={AdminIndex} />
          </Switch>
        </DocumentTitle>
      </Box>
    );
  }
}

IndexPage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default IndexPage;
