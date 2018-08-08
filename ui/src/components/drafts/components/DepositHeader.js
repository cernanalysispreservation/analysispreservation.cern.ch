import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Anchor, Box, Header, Label, Menu } from "grommet";

import SaveIcon from "grommet/components/icons/base/Save";
import ShareIcon from "grommet/components/icons/base/Share";
import TrashIcon from "grommet/components/icons/base/Trash";
import RefreshIcon from "grommet/components/icons/base/Refresh";
import Spinning from "grommet/components/icons/Spinning";
import Status from "grommet/components/icons/Status";
import Edit from "grommet/components/icons/base/Edit";
import SettingsOptionIcon from "grommet/components/icons/base/SettingsOption";
import { withRouter } from "react-router";

const SettingsAnchor = withRouter(({ history, draft_id = draft_id }) => (
  <Anchor
    icon={<SettingsOptionIcon />}
    plain="true"
    label="Access"
    onClick={() => history.push(`/drafts/${draft_id}/settings`)}
  />
));

const EditAnchor = withRouter(({ history, draft_id = draft_id }) => (
  <Anchor
    icon={<Edit />}
    plain="true"
    primary={true}
    label="Edit"
    onClick={() => history.push(`/drafts/${draft_id}/edit`)}
  />
));

class DepositHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  // getStatusBar() {
  //   if (this.props.loading ) {
  //     return [
  //       <Spinning colorIndex="neutral-1" />,
  //       this.props.message && this.props.message.msg
  //     ];
  //   }
  //   else if (this.props.message){
  //     return [
  //       <Status value={this.props.message.status} />,
  //       this.props.message && this.props.message.msg
  //     ]
  //   }

  // }

  render() {
    let status =
      this.props.draft && this.props.draft._deposit
        ? this.props.draft._deposit.status
        : null;
    return (
      <Header flex={true} size="small" pad="none" colorIndex="neutral-1-a">
        <Box flex={true} direction="row" justify="between" align="center">
          <Box
            pad="small"
            flex={true}
            align="center"
            justify="center"
            direction="row"
            wrap={false}
          >
            Analysis Identifier: {this.props.draftId} -{" "}
            {this.props.selectedSchema}
            {this.props.message && (
              <Box
                direction="row"
                pad={{ horizontal: "small" }}
                align="center"
                justify="between"
              >
                {[
                  this.props.loading ? (
                    <Spinning />
                  ) : (
                    <Status value={this.props.message.status} />
                  ),
                  this.props.message && (
                    <Box pad={{ horizontal: "small" }}>
                      <Label size="small">{this.props.message.msg}</Label>
                    </Box>
                  )
                ]}
              </Box>
            )}
          </Box>
          <Box
            flex={false}
            margin={{ right: "small" }}
            pad={{ horizontal: "small" }}
          >
            <Menu
              responsive={true}
              label="Layout"
              direction="row"
              justify="center"
              align="center"
              inline={true}
            >
              {!this.props.saveData && this.props.draft_id ? (
                <Box pad={{ horizontal: "small" }}>
                  <EditAnchor draft_id={this.props.draft_id} />
                </Box>
              ) : null}
              {this.props.saveData ? (
                <React.Fragment>
                  {this.props.draft_id ? (
                    <SettingsAnchor draft_id={this.props.draft_id} />
                  ) : null}
                  {status == "draft" ? (
                    <Anchor
                      icon={<ShareIcon />}
                      label="Share"
                      onClick={
                        this.props.draft_id ? this.props.publishData : null
                      }
                    />
                  ) : null}
                  <Anchor
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={this.props.saveData}
                  />
                  {status == "draft" ? (
                    <Anchor
                      label="Delete"
                      icon={<TrashIcon />}
                      onClick={
                        this.props.draft_id ? this.props.deleteDraft : null
                      }
                      primary={true}
                    />
                  ) : null}
                  {status == "draft" && this.props.draft._deposit.pid ? (
                    <Anchor
                      icon={<RefreshIcon />}
                      label="Discard"
                      onClick={this.props.discardData}
                    />
                  ) : null}
                </React.Fragment>
              ) : null}
            </Menu>
          </Box>
        </Box>
      </Header>
    );
  }
}

DepositHeader.propTypes = {
  selectedSchema: PropTypes.string,
  saveData: PropTypes.func,
  publishData: PropTypes.func,
  draft: PropTypes.object,
  draftId: PropTypes.string,
  message: PropTypes.object,
  loading: PropTypes.bool,
  draft_id: PropTypes.string,
  deleteDraft: PropTypes.func,
  discardData: PropTypes.func
};

function mapStateToProps(state) {
  return {
    selectedSchema: state.drafts.get("selectedSchema"),
    draft_id: state.drafts.getIn(["current_item", "id"]),
    loading: state.drafts.getIn(["current_item", "loading"]),
    message: state.drafts.getIn(["current_item", "message"]),
    draft: state.drafts.getIn(["current_item", "data"])
  };
}

export default connect(mapStateToProps)(DepositHeader);
