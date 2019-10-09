import React from "react";

import Box from "grommet/components/Box";

import PublishedItemIndex from "./PublishedItemIndex";
import { Route } from "react-router-dom";
import { withRouter } from "react-router";

class PublishedIndex extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <Route path={`/published/:id`} component={PublishedItemIndex} />
      </Box>
    );
  }
}

export default withRouter(PublishedIndex);
