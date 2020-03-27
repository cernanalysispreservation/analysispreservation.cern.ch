import React from "react";
import PropTypes from "prop-types";

import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import CMSIndex from "./components/CMSIndex";
import SchemaWizard from "./containers/SchemaWizard";

import { CMS, CMS_EDIT } from "../Routes/paths";

class IndexPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Switch>
          <Route exact path={CMS} component={CMSIndex} />
          <Route path={CMS_EDIT} component={SchemaWizard} />
        </Switch>
      </Box>
    );
  }
}

IndexPage.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default IndexPage;
