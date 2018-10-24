import React from "react";

import { Box } from "grommet";

import { Route } from "react-router-dom";

import CreateDraftHeader from "./CreateDraftHeader";
import DraftEditorHeader from "./DraftEditorHeader";
import DraftDefaultHeader from "./DraftDefaultHeader";

class DraftHeader extends React.Component {
  render() {
    return (
      <Box colorIndex="neutral-1-a" flex={false} wrap={false} direction="row">
        <Route path="/drafts/create/:schema_id" component={CreateDraftHeader} />
        <Route path="/drafts/:draft_id/edit" component={DraftEditorHeader} />
        <Route
          path="/drafts/:draft_id/settings"
          component={DraftDefaultHeader}
        />
        <Route exact path="/drafts/:draft_id" component={DraftDefaultHeader} />
      </Box>
    );
  }
}

export default DraftHeader;
