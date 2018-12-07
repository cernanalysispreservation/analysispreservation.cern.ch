import React from "react";

import { Switch, Route } from "react-router-dom";

import Box from "grommet/components/Box";

// Components
import DraftHeader from "./components/DraftHeader";

// Containers
import DraftsItemIndex from "./DraftsItemIndex";
import DraftEditor from "./DraftEditor";
import SearchPage from "../search/SearchPage";

class DraftsIndex extends React.Component {
  constructor(props) {
    super(props);

    // Create the ref for the form
    this.formRef = React.createRef();
  }

  render() {
    return (
      <Box flex={true}>
        <DraftHeader formRef={this.formRef} />
        <Switch>
          <Route exact path="/drafts" component={SearchPage} />
          <Route
            exact
            path="/drafts/create/:schema_id"
            render={props => <DraftEditor {...props} formRef={this.formRef} />}
          />

          <Route
            path="/drafts/:draft_id"
            render={props => (
              <DraftsItemIndex {...props} formRef={this.formRef} />
            )}
          />
        </Switch>
      </Box>
    );
  }
}

export default DraftsIndex;
