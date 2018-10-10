import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import DraftActionsButtons from "./DraftActionsButtons";
import DraftActionsLayer from "./DraftActionsLayer";

import { withRouter } from "react-router";

import {
  createDraft,
  formDataChange,
  publishDraft,
  deleteDraft,
  updateDraft,
  discardDraft,
  editPublished,
  toggleActionsLayer
} from "../../../actions/drafts";

class DraftActionsHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actionType: null
    };
  }

  _saveData() {
    let status =
      this.props.draft && this.props.draft._deposit
        ? this.props.draft._deposit.status
        : null;
    if (this.props.match.params.schema_id)
      this.props.createDraft(
        this.props.formData,
        this.props.match.params.schema_id
      );
    else if (status !== "published")
      this.props.updateDraft({ ...this.props.formData }, this.props.draft_id);
    else if (status == "published")
      this.props.editPublished(
        { ...this.props.formData, $schema: this.props.draft.$schema },
        this.props.match.params.schema_id,
        this.props.draft_id
      );
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
    return [
      <DraftActionsButtons
        key="action-buttons"
        type={this.props.type || "default"}
        backButton={this.props.backButton}
        saveData={this._actionHandler("save")}
        publishData={this._actionHandler("publish")}
        deleteDraft={this._actionHandler("delete")}
        discardData={this._actionHandler("discard")}
      />,
      <DraftActionsLayer
        key="action-layer"
        type={this.state.actionType}
        saveData={this._saveData.bind(this)}
        publishData={this._publishData.bind(this)}
        deleteDraft={this._deleteDraft.bind(this)}
        discardData={this._discardData.bind(this)}
      />
    ];
  }
}

DraftActionsHeader.propTypes = {
  actionsLayer: PropTypes.bool,

  formData: PropTypes.object,
  schemaId: PropTypes.object,

  toggleActionsLayer: PropTypes.func,

  deleteDraft: PropTypes.func,
  publishDraft: PropTypes.func,
  discardDraft: PropTypes.func,
  updateDraft: PropTypes.func,
  createDraft: PropTypes.func,
  formDataChange: PropTypes.func,
  editPublished: PropTypes.func
};

function mapStateToProps(state) {
  return {
    draft_id: state.drafts.getIn(["current_item", "id"]),
    draft: state.drafts.getIn(["current_item", "data"]),
    formData: state.drafts.getIn(["current_item", "formData"]),
    actionsLayer: state.drafts.get("actionsLayer")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createDraft: (data, schema) => dispatch(createDraft(data, schema)),
    updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
    publishDraft: draft_id => dispatch(publishDraft(draft_id)),
    deleteDraft: draft_id => dispatch(deleteDraft(draft_id)),
    discardDraft: draft_id => dispatch(discardDraft(draft_id)),
    editPublished: (data, schema, draft_id) =>
      dispatch(editPublished(data, schema, draft_id)),

    formDataChange: data => dispatch(formDataChange(data)),
    toggleActionsLayer: () => dispatch(toggleActionsLayer())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftActionsHeader)
);
