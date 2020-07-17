import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "../../partials/Anchor";
import Box from "grommet/components/Box";
import {
  AiOutlineArrowLeft,
  AiOutlineFolderOpen,
  AiOutlineFolder
} from "react-icons/ai";

import EditableTitle from "./EditableTitle";

class DraftDefaultHeader extends React.Component {
  render() {
    if (this.props.error && this.props.error.status == 403) return null;
    return (
      <Box flex={true} direction="row">
        <Box direction="row" flex={true} wrap={false} responsive={false}>
          <Box
            align="center"
            justify="center"
            style={{ padding: "12px" }}
            data-tip="Dashboard"
            data-place="right"
          >
            <Anchor path={{ path: `/` }}>
              <AiOutlineArrowLeft
                style={{ height: "24px", width: "24px", color: "black" }}
              />
            </Anchor>
          </Box>
          <Box
            justify="center"
            flex={true}
            wrap={true}
            separator="left"
            className="align-center-md"
            pad={{ horizontal: "small" }}
          >
            <EditableTitle />
          </Box>
          <Box align="center" justify="center" pad={{ horizontal: "small" }}>
            {this.props.expanded ? (
              <Box
                onClick={this.props.onClick}
                direction="row"
                responsive={false}
                justify="center"
                align="center"
              >
                <Box margin={{ right: "small" }}>
                  <AiOutlineFolderOpen
                    style={{ height: "24px", width: "24px", color: "black" }}
                  />
                </Box>
                Files
              </Box>
            ) : (
              <Box
                onClick={this.props.onClick}
                direction="row"
                responsive={false}
                justify="center"
                align="center"
              >
                <Box margin={{ right: "small" }}>
                  <AiOutlineFolder
                    style={{ height: "24px", width: "24px", color: "black" }}
                  />
                </Box>
                Files
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
}

DraftDefaultHeader.propTypes = {
  draft: PropTypes.object,
  id: PropTypes.string,
  error: PropTypes.object,
  draft_id: PropTypes.string,
  canUpdate: PropTypes.bool,
  expanded: PropTypes.bool,
  onClick: PropTypes.func
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    canUpdate: state.draftItem.get("can_update"),
    draft: state.draftItem.get("metadata"),
    errors: state.draftItem.get("errors"),
    schema: state.draftItem.get("schema"),
    formData: state.draftItem.get("formData")
  };
}

export default connect(mapStateToProps)(DraftDefaultHeader);
