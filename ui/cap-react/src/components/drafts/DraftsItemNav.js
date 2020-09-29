import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { matchPath } from "react-router";
import { withRouter } from "react-router-dom";

import Anchor from "../partials/Anchor";

import Box from "grommet/components/Box";

import {
  AiOutlineDelete,
  AiOutlineAppstore,
  AiOutlineTag,
  AiOutlineShareAlt,
  AiOutlinePlayCircle,
  AiOutlineBranches
} from "react-icons/ai";

// Actions
import { toggleActionsLayer } from "../../actions/draftItem";

const NAV_IMAGE_SIZE = 24;

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
        className="md-row animated-nav-wrapper"
        justify="between"
      >
        <Box className="small-row-medium-column md-row animated-nav" flex>
          <Box className="animated-nav-row">
            <Anchor path={{ path: `/drafts/${draft_id}`, index: true }}>
              <Box
                justify="center"
                className="animated-nav-container"
                align="center"
                pad="small"
                direction="row"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <Box flex>
                  <AiOutlineAppstore size={NAV_IMAGE_SIZE} color="#000" />
                </Box>
                <Box flex className="animated-nav-text">
                  Overview
                </Box>
              </Box>
            </Anchor>
          </Box>
          <Box className="animated-nav-row">
            <Anchor path={`/drafts/${draft_id}/edit`}>
              <Box
                justify="center"
                className="animated-nav-container"
                align="center"
                pad="small"
                direction="row"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/edit",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <Box flex>
                  <AiOutlineTag size={NAV_IMAGE_SIZE} color="#000" />
                </Box>
                <Box flex className="animated-nav-text">
                  Edit
                </Box>
              </Box>
            </Anchor>
          </Box>
          <Box className="animated-nav-row">
            <Anchor path={`/drafts/${draft_id}/integrations`}>
              <Box
                justify="center"
                className="animated-nav-container"
                align="center"
                pad="small"
                direction="row"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/integrations",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <Box flex>
                  <AiOutlineBranches size={NAV_IMAGE_SIZE} color="#000" />
                </Box>
                <Box flex className="animated-nav-text">
                  Connect
                </Box>
              </Box>
            </Anchor>
          </Box>
          <Box className="animated-nav-row">
            <Anchor path={`/drafts/${draft_id}/workflows`} disabled>
              <Box
                justify="center"
                className="animated-nav-container"
                align="center"
                pad="small"
                direction="row"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/workflows",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <Box flex>
                  <AiOutlinePlayCircle size={NAV_IMAGE_SIZE} color="#000" />
                </Box>
                <Box flex className="animated-nav-text">
                  Workflows
                </Box>
              </Box>
            </Anchor>
          </Box>
          <Box className="animated-nav-row">
            <Anchor path={`/drafts/${draft_id}/settings`}>
              <Box
                justify="betweceen"
                className="animated-nav-container"
                align="center"
                pad="small"
                direction="row"
                colorIndex={
                  matchPath(this.props.location.pathname, {
                    path: "/drafts/:draft_id/settings",
                    exact: true
                  })
                    ? "light-1"
                    : null
                }
              >
                <Box flex>
                  <AiOutlineShareAlt size={NAV_IMAGE_SIZE} color="#000" />
                </Box>
                <Box flex className="animated-nav-text">
                  Share
                </Box>
              </Box>
            </Anchor>
          </Box>

          <Box className="nav-delete-div">
            {isDraft &&
              !isPublishedOnce && (
                <Box className="animated-nav-row ">
                  <Anchor onClick={this._actionHandler("delete")}>
                    <Box
                      justify="center"
                      className="animated-nav-container"
                      align="center"
                      pad="small"
                      direction="row"
                    >
                      <Box flex>
                        <AiOutlineDelete size={NAV_IMAGE_SIZE} color="#000" />
                      </Box>
                      <Box flex className=" animated-nav-text ">
                        Delete
                      </Box>
                    </Box>
                  </Anchor>
                </Box>
              )}
          </Box>
        </Box>
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
  location: PropTypes.object,
  canAdmin: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid"),
    canAdmin: state.draftItem.get("can_admin")
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
