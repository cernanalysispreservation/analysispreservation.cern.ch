import React from "react";

import Box from "grommet/components/Box";

import { Route } from "react-router-dom";

import DraftEditorHeader from "./DraftEditorHeader";
import DraftDefaultHeader from "./DraftDefaultHeader";
import DraftActionsLayer from "./DraftActionsLayer";

import PropTypes from "prop-types";

class DraftHeader extends React.Component {
  render() {
    return (
      <Box
        colorIndex="light-2"
        flex={false}
        justify="between"
        direction="row"
        separator="bottom"
      >
        <DraftDefaultHeader />
        <Box size={{ width: "medium" }}>
          <Route
            path="/drafts/:draft_id/edit"
            render={props => (
              <DraftEditorHeader {...props} formRef={this.props.formRef} />
            )}
          />
        </Box>
        <DraftActionsLayer />
      </Box>
    );
  }
}

DraftHeader.propTypes = {
  formRef: PropTypes.object
};

export default DraftHeader;
