import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, Menu } from "grommet";

import {
  SaveAnchor,
  SettingsAnchor,
  ShareAnchor,
  DiscardAnchor,
  DeleteAnchor,
  DraftMessage
} from "./DraftActionsButtons";

import EditableTitle from "./EditableTitle";

import {
  publishDraft,
  deleteDraft,
  updateDraft,
  discardDraft,
  editPublished,
  toggleActionsLayer
} from "../../../actions/drafts";

import DragIcon from "grommet/components/icons/base/Drag";
import DraftActionsLayer from "./DraftActionsLayer";

class DraftEditorHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = { actionType: null };
  }

  _validateFormData() {
    const formData = this.props.formRef.current.props.formData;
    const { errors } = this.props.formRef.current.validate(formData);

    let e = new Event("save");

    this.props.formRef.current.onSubmit(e);

    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  _saveData() {
    if (this._validateFormData()) {
      let status =
        this.props.draft && this.props.draft._deposit
          ? this.props.draft._deposit.status
          : null;
      if (status !== "published")
        this.props
          .updateDraft({ ...this.props.formData }, this.props.draft_id)
          .finally(() => {
            this._validateFormData();
          });
      else if (status == "published")
        this.props
          .editPublished(
            { ...this.props.formData, $schema: this.props.draft.$schema },
            this.props.match.params.schema_id,
            this.props.draft_id
          )
          .finally(() => {
            this._validateFormData();
          });
    }
  }

  _publishData() {
    this.props.publishDraft(this.props.draft_id);
  }

  _deleteDraft() {
    this.props.deleteDraft(this.props.draft_id);
  }

  _discardData() {
    this.props.discardDraft(this.props.draft_id);
  }

  _actionHandler = type => () => {
    this.props.toggleActionsLayer();
    this.setState({ actionType: type });
  };

  render() {
    let status =
      this.props.draft && this.props.draft._deposit
        ? this.props.draft._deposit.status
        : null;

    let isDraft = status == "draft" ? true : false;
    let isPublishedOnce =
      this.props.draft && this.props.draft._deposit
        ? this.props.draft._deposit.pid
        : null;

    // let dg = null;
    // if (this.props.schema) {
    //   let schema = this.props.schema.split("/");

    //   schema = schema[schema.length - 1];
    //   schema = schema.split("-v0")[0];

    //   let group =
    //     this.props.depositGroups &&
    //     this.props.depositGroups
    //       .toJS()
    //       .filter(dg => dg.deposit_group == schema);

    //   if (group && group.length > 0) dg = group[0];
    // }

    if (this.props.error && this.props.error.status == 403) return null;

    return (
      <Box flex={true} wrap={false} direction="row">
        <Box
          pad={{ horizontal: "small" }}
          justify="start"
          align="center"
          direction="row"
          flex={true}
          wrap={false}
        >
          <Box margin={{ right: "small" }}>
            <DragIcon size="xsmall" />
          </Box>
          <EditableTitle />
        </Box>

        <Box flex={true} justify="center" align="end">
          <DraftMessage
            key="draft-message"
            message={this.props.message}
            loading={this.props.loading}
          />
        </Box>
        <Box
          pad={{ horizontal: "small" }}
          flex={false}
          direction="row"
          wrap={false}
          justify="end"
          align="center"
        >
          {isDraft ? (
            <Menu
              flex={false}
              direction="row"
              wrap={false}
              responsive={false}
              margin={{ horizontal: "small" }}
              size="small"
              pad={{ horizontal: "small" }}
              alignContent="center"
              justify="center"
              align="center"
              colorIndex="neutral-4"
            >
              <ShareAnchor action={this._actionHandler("publish")} />
            </Menu>
          ) : null}

          <Menu
            flex={false}
            direction="row"
            wrap={false}
            responsive={false}
            margin={{ horizontal: "small" }}
            size="small"
            pad={{ horizontal: "small" }}
            alignContent="center"
            justify="center"
            align="center"
            colorIndex="neutral-1-t"
          >
            {this.props.draft_id ? (
              <SettingsAnchor draft_id={this.props.draft_id} />
            ) : null}

            {isDraft && !isPublishedOnce ? (
              <DeleteAnchor action={this._actionHandler("delete")} />
            ) : null}

            {isDraft && isPublishedOnce ? (
              <DiscardAnchor action={this._actionHandler("discard")} />
            ) : null}
          </Menu>

          <Menu
            flex={false}
            direction="row"
            wrap={false}
            responsive={false}
            size="small"
            pad={{ horizontal: "small" }}
            alignContent="center"
            justify="center"
            align="center"
            colorIndex="brand"
          >
            <SaveAnchor action={this._saveData.bind(this)} />
          </Menu>
        </Box>
        <DraftActionsLayer
          key="action-layer"
          type={this.state.actionType}
          saveData={this._saveData.bind(this)}
          publishData={this._publishData.bind(this)}
          deleteDraft={this._deleteDraft.bind(this)}
          discardData={this._discardData.bind(this)}
        />
      </Box>
    );
  }
}

DraftEditorHeader.propTypes = {
  match: PropTypes.object.isRequired,
  draft: PropTypes.object,
  id: PropTypes.string
};

function mapStateToProps(state) {
  return {
    draft_id: state.drafts.getIn(["current_item", "id"]),
    draft: state.drafts.getIn(["current_item", "data"]),
    schema: state.drafts.getIn(["current_item", "schema"]),
    formData: state.drafts.getIn(["current_item", "formData"]),
    depositGroups: state.auth.getIn(["currentUser", "depositGroups"]),

    error: state.drafts.getIn(["current_item", "error"]),
    loading: state.drafts.getIn(["current_item", "loading"]),
    message: state.drafts.getIn(["current_item", "message"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
    publishDraft: draft_id => dispatch(publishDraft(draft_id)),
    deleteDraft: draft_id => dispatch(deleteDraft(draft_id)),
    discardDraft: draft_id => dispatch(discardDraft(draft_id)),
    editPublished: (data, schema, draft_id) =>
      dispatch(editPublished(data, schema, draft_id)),
    toggleActionsLayer: () => dispatch(toggleActionsLayer())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftEditorHeader);
