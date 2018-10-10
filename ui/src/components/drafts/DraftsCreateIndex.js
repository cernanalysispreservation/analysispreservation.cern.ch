import React from "react";
import PropTypes from "prop-types";

import { Switch, Route } from "react-router-dom";

import AvailableDeposits from "./AvailableDeposits";
import DraftEditor from "./DraftEditor";

class DraftsCreateIndex extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/drafts/create" component={AvailableDeposits} />
        <Route path="/drafts/create/:schema_id" component={DraftEditor} />
      </Switch>
    );
  }
}

export default DraftsCreateIndex;
