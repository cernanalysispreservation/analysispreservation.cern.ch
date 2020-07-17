import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { matchPath } from "react-router";
import { withRouter } from "react-router-dom";
import DocumentIcon from "grommet/components/icons/base/Document";
import PlayIcon from "grommet/components/icons/base/Play";

import ConnectIcon from "grommet/components/icons/base/Connect";
import Anchor from "../partials/Anchor";
import ReactTooltip from "react-tooltip";
import Box from "grommet/components/Box";

import TrashIcon from "grommet/components/icons/base/Trash";
import AppsIcon from "grommet/components/icons/base/Apps";

// Actions
import { toggleActionsLayer } from "../../actions/draftItem";

import ShareIcon from "grommet/components/icons/base/Share";

class DraftsItemNav extends React.Component {
  constructor(props) {
    super(props);
  }

  _actionHandler = type => () => {
    this.props.toggleActionsLayer(type);
  };

  render() {
    let { draft_id } = this.props.match.params;
    let isDraft = this.props.status == "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;

    return (
      <Box
        flex={false}
        colorIndex="light-2"
        justify="between"
        className="md-row"
      >
        <Box className="md-row" flex>
          <ReactTooltip />
          <Box data-tip="Overview" data-place="right">
            <Anchor path={{ path: `/drafts/${draft_id}`, index: true }}>
              <Box
                justify="center"
                align="center"
                pad="small"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <AppsIcon />
              </Box>
            </Anchor>
          </Box>
          <Box data-tip="Edit metadata" data-place="right">
            <Anchor path={`/drafts/${draft_id}/edit`}>
              <Box
                justify="center"
                align="center"
                pad="small"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/edit",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <DocumentIcon />
              </Box>
            </Anchor>
          </Box>
          <Box data-tip="Connect your repositories" data-place="right">
            <Anchor path={`/drafts/${draft_id}/integrations`}>
              <Box
                justify="center"
                align="center"
                pad="small"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/integrations",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <ConnectIcon />
              </Box>
            </Anchor>
          </Box>
          <Box data-tip="Run workflows - in BETA soon" data-place="right">
            <Anchor path={`/drafts/${draft_id}/workflows`} disabled>
              <Box
                justify="center"
                align="center"
                pad="small"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/workflows",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <PlayIcon />
              </Box>
            </Anchor>
          </Box>
          <Box data-tip="Share with others" data-place="right">
            <Anchor path={`/drafts/${draft_id}/settings`}>
              <Box
                justify="center"
                align="center"
                pad="small"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/settings",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <ShareIcon />
              </Box>
            </Anchor>
          </Box>
        </Box>

        {isDraft && !isPublishedOnce ? (
          <Anchor
            icon={<TrashIcon />}
            onClick={this._actionHandler("delete")}
            data-tip="Delete your analysis"
          />
        ) : null}
      </Box>
    );
  }
}

DraftsItemNav.propTypes = {
  getDraftById: PropTypes.func,
  match: PropTypes.object.isRequired,
  status: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  message: PropTypes.string,
  draft_id: PropTypes.string,
  id: PropTypes.string,
  toggleActionsLayer: PropTypes.func,
  recid: PropTypes.string,
  location: PropTypes.object
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleActionsLayer: type => dispatch(toggleActionsLayer(type))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsItemNav)
);
