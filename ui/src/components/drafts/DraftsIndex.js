import React from "react";

import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

// Components
import DraftHeader from "./components/DraftHeader";

// Containers
import DraftsItemIndex from "./DraftsItemIndex";
import DraftsCreateIndex from "./DraftsCreateIndex";

class DraftsIndex extends React.Component {
  render() {
    return (
      <Box flex={true}>
        <DraftHeader />
        <Switch>
          <Route path="/drafts/create" component={DraftsCreateIndex} />
          <Route path="/drafts/:draft_id" component={DraftsItemIndex} />
        </Switch>
      </Box>
    );
  }
}

export default DraftsIndex;
