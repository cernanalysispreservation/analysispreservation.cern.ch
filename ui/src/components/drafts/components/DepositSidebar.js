import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router";

import { Box, Anchor, Sidebar } from "grommet";

import AddIcon from "grommet/components/icons/base/Add";

import { toggleFilemanagerLayer } from "../../../actions/drafts";

import SectionHeader from "./SectionHeader";
import DepositFilesList from "./DepositFilesList";

class DepositSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Sidebar full={false} size="medium" colorIndex="light-2">
        <Box flex={true}>
          <SectionHeader
            label="Files | Data | Source Code"
            icon={
              this.props.draft_id ? (
                <Anchor
                  onClick={this.props.toggleFilemanagerLayer}
                  size="xsmall"
                  icon={<AddIcon />}
                />
              ) : null
            }
          />
          <DepositFilesList
            files={this.props.files || []}
            draft_id={this.props.draft_id}
          />
        </Box>
      </Sidebar>
    );
  }
}

DepositSidebar.propTypes = {
  showSidebar: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  draft_id: PropTypes.string,
  match: PropTypes.object,
  files: PropTypes.object
};

function mapStateToProps(state) {
  return {
    showSidebar: state.drafts.get("showSidebar"),
    files: state.drafts.getIn(["current_item", "files"]),
    draft_id: state.drafts.getIn(["current_item", "id"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DepositSidebar)
);
