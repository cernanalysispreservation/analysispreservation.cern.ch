import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Anchor, Box, Label, Menu } from "grommet";

import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";
import SaveIcon from "grommet/components/icons/base/Save";
import ShareIcon from "grommet/components/icons/base/Share";
import TrashIcon from "grommet/components/icons/base/Trash";
import RefreshIcon from "grommet/components/icons/base/Refresh";
import Edit from "grommet/components/icons/base/Edit";
import SettingsOptionIcon from "grommet/components/icons/base/SettingsOption";
import Spinning from "grommet/components/icons/Spinning";
import Status from "grommet/components/icons/Status";

import { withRouter } from "react-router";

const SettingsAnchor = withRouter(({ history, draft_id = draft_id }) => (
  <Anchor
    icon={<SettingsOptionIcon size="xsmall" />}
    plain="true"
    label={<Label size="small">Access</Label>}
    onClick={() => history.push(`/drafts/${draft_id}/settings`)}
  />
));

const EditAnchor = withRouter(({ history, draft_id = draft_id }) => (
  <Box colorIndex="brand" pad={{ horizontal: "small" }}>
    <Anchor
      icon={<Edit size="xsmall" />}
      primary={true}
      label={<Label size="small">Edit</Label>}
      onClick={() => history.push(`/drafts/${draft_id}/edit`)}
    />
  </Box>
));

const BackToEditAnchor = withRouter(({ history, draft_id = null }) => {
  return (
    <Anchor
      icon={<LinkPreviousIcon size="xsmall" />}
      plain="true"
      primary={true}
      label={<Label size="small">go to edit</Label>}
      onClick={() => history.push(`/drafts/${draft_id}/edit`)}
    />
  );
});

const ShareAnchor = ({ action = null }) => (
  <Anchor
    icon={<ShareIcon size="xsmall" />}
    label={<Label size="small">Share</Label>}
    onClick={action ? action : null}
  />
);

const SaveAnchor = ({ action = null }) => (
  <Anchor
    icon={<SaveIcon size="xsmall" />}
    label={<Label size="small">Save</Label>}
    onClick={action ? action : null}
  />
);

const DeleteAnchor = ({ action = null }) => (
  <Anchor
    label={<Label size="small">Delete</Label>}
    icon={<TrashIcon size="xsmall" />}
    onClick={action ? action : null}
  />
);

const DiscardAnchor = ({ action = null }) => (
  <Anchor
    label={<Label size="small">Discard</Label>}
    icon={<RefreshIcon size="xsmall" />}
    onClick={action ? action : null}
  />
);

class DepositHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let status =
      this.props.draft && this.props.draft._deposit
        ? this.props.draft._deposit.status
        : null;

    return (
      <Box
        flex={false}
        pad={{ horizontal: "small" }}
        colorIndex="neutral-1-t"
        direction="row"
        justify="between"
        align="center"
      >
        {this.props.type == "default" ? (
          <Box flex={true}>
            <BackToEditAnchor draft_id={this.props.draft_id} />
          </Box>
        ) : null}

        {this.props.type == "actions"
          ? [
              <Box flex={false} direction="row" key="draft-buttons">
                <Menu
                  responsive={true}
                  label="Layout"
                  size="small"
                  direction="row"
                  justify="center"
                  align="center"
                  inline={true}
                >
                  {this.props.saveData ? (
                    <React.Fragment>
                      <SaveAnchor action={this.props.saveData} />
                      {this.props.draft_id ? (
                        <SettingsAnchor draft_id={this.props.draft_id} />
                      ) : null}

                      {status == "draft" ? (
                        <ShareAnchor action={this.props.publishData} />
                      ) : null}

                      {status == "draft" ? (
                        <DeleteAnchor action={this.props.deleteDraft} />
                      ) : null}

                      {status == "draft" && this.props.draft._deposit.pid ? (
                        <DiscardAnchor action={this.props.discardData} />
                      ) : null}
                    </React.Fragment>
                  ) : null}
                </Menu>
              </Box>,
              <DraftMessage
                key="draft-message"
                message={this.props.message}
                loading={this.props.loading}
              />
            ]
          : null}

        {this.props.type == "preview" ? (
          <Box flex={true} align="end">
            {" "}
            <EditAnchor size="xsmall" draft_id={this.props.draft_id} />{" "}
          </Box>
        ) : null}
      </Box>
    );
  }
}

let DraftMessage = ({ message, loading }) => {
  return message ? (
    <Box
      colorIndex="light-1"
      direction="row"
      pad={{ horizontal: "small" }}
      align="center"
      justify="between"
      margin={{ left: "small" }}
    >
      {[
        loading ? (
          <Spinning key="loading-spinner" />
        ) : (
          <Status size="small" key="loading" value={message.status} />
        ),
        message && (
          <Box key="message" pad={{ horizontal: "small" }}>
            <Label size="small">{message.msg}</Label>
          </Box>
        )
      ]}
    </Box>
  ) : null;
};

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
