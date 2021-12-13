import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Anchor from "../../partials/Anchor";
import Box from "grommet/components/Box";
import {
  AiOutlineArrowLeft,
  AiOutlineFolderOpen,
  AiOutlineFolder
} from "react-icons/ai";

import { updateGeneralTitle } from "../../../actions/draftItem";
import ReactTooltip from "react-tooltip";
import EditableField from "../../partials/EditableField";
import Loading from "../../partials/LoadingSkeleton";
import { canEdit } from "../utils/permissions";
import Tag from "../../partials/Tag";

class DraftDefaultHeader extends React.Component {
  render() {
    return (
      <Box flex={true} direction="row">
        <Box direction="row" flex={true} wrap={false} responsive={false}>
          <Box
            align="center"
            justify="center"
            style={{ padding: "12px" }}
            data-tip={this.props.location.pageFrom || "Dashboard"}
            data-place="right"
          >
            <Anchor
              path={
                this.props.location.from
                  ? { path: this.props.location.from }
                  : { path: `/` }
              }
            >
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
            {this.props.loading ? (
              <Loading height={20} width={10} />
            ) : (
              <Box direction="row">
                <EditableField
                  value={this.props.metadata.general_title}
                  emptyValue={"Untitled document"}
                  onUpdate={val => {
                    if (val.trim() === "") return;
                    this.props.updateGeneralTitle(val);
                  }}
                  isEditable={
                    this.props.status == "draft" &&
                    canEdit(this.props.canAdmin, this.props.canUpdate)
                  }
                  dataCy="general-title-input"
                />
              </Box>
            )}
          </Box>
          {!canEdit(this.props.canAdmin, this.props.canUpdate) && (
            <Box
              data-tip="You do not have permissions to edit this draft"
              align="center"
              justify="center"
            >
              <Tag
                size="large"
                color={{
                  bgcolor: "rgb(254, 247, 225)",
                  border: "rgb(254, 247, 225)",
                  color: "rgb(232,134,34)"
                }}
                margin="0 10px  "
                text={
                  <span
                    style={{
                      fontWeight: "bold",
                      letterSpacing: "1px"
                    }}
                  >
                    READ ONLY
                  </span>
                }
              />
              <ReactTooltip />
            </Box>
          )}
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
  draft_id: PropTypes.string,
  status: PropTypes.string,
  canUpdate: PropTypes.bool,
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
  location: PropTypes.object,
  metadata: PropTypes.object,
  updateGeneralTitle: PropTypes.func,
  loading: PropTypes.bool,
  canAdmin: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    canUpdate: state.draftItem.get("can_update"),
    canAdmin: state.draftItem.get("can_admin"),
    draft: state.draftItem.get("metadata"),
    schema: state.draftItem.get("schema"),
    formData: state.draftItem.get("formData"),
    metadata: state.draftItem.get("metadata"),
    loading: state.draftItem.get("loading")
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateGeneralTitle: (title, anaType) =>
      dispatch(updateGeneralTitle(title, anaType))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DraftDefaultHeader));
