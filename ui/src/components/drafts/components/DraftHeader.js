import React from "react";

import { Box } from "grommet";

import { Route } from "react-router-dom";

import DraftEditorHeader from "./DraftEditorHeader";
import DraftDefaultHeader from "./DraftDefaultHeader";

class DraftHeader extends React.Component {
  render() {
    return (
      <Box
        colorIndex="neutral-1-a"
        flex={false}
        justify="between"
        direction="row"
      >
        <Route
          path={["/drafts/:draft_id/edit", "/drafts/create/:schema_id"]}
          render={props => (
            <DraftEditorHeader {...props} formRef={this.props.formRef} />
          )}
        />
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
