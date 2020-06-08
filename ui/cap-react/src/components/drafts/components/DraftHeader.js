import React from "react";

import Box from "grommet/components/Box";

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
        <DraftDefaultHeader
          expanded={this.props.expanded}
          onClick={this.props.expandCollapse}
        />
        <DraftActionsLayer />
      </Box>
    );
  }
}

DraftHeader.propTypes = {
  formRef: PropTypes.object,
  expanded: PropTypes.bool,
  expandCollapse: PropTypes.func
};

export default DraftHeader;
