import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";

import AddIcon from "grommet/components/icons/base/Add";

import { toggleFilemanagerLayer } from "../../../actions/draftItem";

import SectionHeader from "./SectionHeader";
import DepositFilesList from "./DepositFilesList";

import { Route } from "react-router-dom";

import TimeAgo from "react-timeago";

class DepositSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderAddFileIcon() {
    if (this.props.status !== "published") {
      if (this.props.canUpdate) {
        return (
          <Route
            path="/drafts/:draft_id/"
            render={() => (
              <Box
                colorIndex="light-2"
                onClick={this.props.toggleFilemanagerLayer}
                style={{ padding: "5px" }}
              >
                <AddIcon size="small" />
              </Box>
            )}
          />
        );
      }
    }
  }

  render() {
    return (
      <Sidebar
        full={false}
        size="medium"
        colorIndex="light-2"
        separator="left"
        className="lg-row"
      >
        <Box flex={false} pad="none">
          <Box flex={false} pad="small" style={{ fontWeight: "100" }}>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              margin={{ bottom: "small" }}
              responsive={false}
            >
              ID <span>{this.props.id}</span>
            </Box>

            <Box
              direction="row"
              wrap={false}
              justify="between"
              margin={{ bottom: "small" }}
              responsive={false}
            >
              Status <span>{this.props.status}</span>
            </Box>

            <Box
              direction="row"
              wrap={false}
              justify="between"
              margin={{ bottom: "small" }}
              responsive={false}
            >
              Creator <span>{this.props.created_by}</span>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              margin={{ bottom: "small" }}
              responsive={false}
            >
              Created:{" "}
              <strong>
                <TimeAgo date={this.props.created} minPeriod="60" />
              </strong>
            </Box>
            <Box
              direction="row"
              wrap={false}
              justify="between"
              responsive={false}
            >
              Last Updated:{" "}
              <strong>
                <TimeAgo date={this.props.updated} minPeriod="60" />
              </strong>
            </Box>
          </Box>
        </Box>
        <Box flex={true} pad="none" colorIndex="light-1">
          <SectionHeader
            label="Files | Data | Repos"
            uppercase={true}
            icon={this._renderAddFileIcon()}
          />
          <DepositFilesList files={this.props.files} />
        </Box>
      </Sidebar>
    );
  }
}

DepositSidebar.propTypes = {
  toggleFilemanagerLayer: PropTypes.func,
  files: PropTypes.object,
  created_by: PropTypes.string,
  updated: PropTypes.string,
  created: PropTypes.string,
  experiment: PropTypes.string,
  status: PropTypes.string,
  id: PropTypes.string,
  canUpdate: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    files: state.draftItem.get("bucket"),
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    experiment: state.draftItem.get("experiment"),
    revision: state.draftItem.get("revision"),
    created_by: state.draftItem.get("created_by"),
    created: state.draftItem.get("created"),
    updated: state.draftItem.get("updated"),
    canUpdate: state.draftItem.get("can_update")
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
