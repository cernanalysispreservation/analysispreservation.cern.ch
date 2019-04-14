import React from "react";
import PropTypes from "prop-types";

import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

import CMSIndex from "./components/CMSIndex";
import SchemaWizard from "./containers/SchemaWizard";

class IndexPage extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Switch>
          <Route exact path="/cms/" component={CMSIndex} />
          <Route path="/cms/edit" component={SchemaWizard} />
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
