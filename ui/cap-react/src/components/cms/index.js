import React from "react";
import PropTypes from "prop-types";

import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import CMSIndex from "./components/CMSIndex";
import SchemaWizard from "./containers/SchemaWizard";

import DocumentTitle from "../partials/Title";
import { CMS, CMS_EDIT } from "../routes";

class IndexPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <DocumentTitle title="Form Builder">
          <Switch>
            <Route exact path={CMS} component={CMSIndex} />
            <Route path={CMS_EDIT} component={SchemaWizard} />
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
