import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, Toast, Layer, Paragraph, Button } from "grommet";

import {
  fetchSchema,
  createDraft,
  initForm,
  formDataChange,
  getDraftById,
  publishDraft,
  deleteDraft,
  updateDraft,
  discardDraft,
  editPublished,
  toggleActionsLayer
} from "../../actions/drafts";

import DepositForm from "./form/Form";
import DepositHeader from "./components/DepositHeader";
import Sidebar from "./components/DepositSidebar";
import Previewer from "./components/DepositPreviewer";

const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "control_number"
  ];

  schema.properties = _.omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies
  };
  return schema;
};

class CreateDeposit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.match.params.draft_id) {
      if (this.props.match.params.draft_id !== this.props.draft_id) {
        this.props.getDraftById(this.props.match.params.draft_id, true);
      }
    }
    if (this.props.match.params.schema_id) {
      this.props.initForm();
      this.props.fetchSchema(this.props.match.params.schema_id);
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.match.params.draft_id) {
      if (nextProps.match.params.draft_id !== nextProps.draft_id) {
        // nextProps.getDraftById(nextProps.match.params.draft_id, true);
      }
    }
    return true;
  }

  _saveData() {
    let status = this.props.draft ? this.props.draft._deposit.status : null;
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

  renderAction(action) {
    switch (action) {
      case "save":
        this._saveData();
        this.props.toggleActionsLayer();
        break;
      case "publish":
        this._publishData();
        this.props.toggleActionsLayer();
        break;
      case "delete":
        this._deleteDraft();
        this.props.toggleActionsLayer();
        break;
      case "discard":
        this._discardData();
        this.props.toggleActionsLayer();
        break;
    }
  }

  renderMessage(action) {
    switch (action) {
      case "save":
        return (
          <Paragraph>Are you sure you want to save your changes?</Paragraph>
        );
      case "publish":
        return (
          <Paragraph>
            Your analysis will now be visible to all members of collaboration.
            Proceed?
          </Paragraph>
        );
      case "delete":
        return (
          <Paragraph>Are you sure you want to delete this draft?</Paragraph>
        );
      case "discard":
        return (
          <Paragraph>
            Discard changes to the previous published version?
          </Paragraph>
        );
    }
  }

  render() {
    let _schema = this.props.schema ? transformSchema(this.props.schema) : null;
    return (
      <Box id="deposit-page" flex={true}>
        {this.props.error ? (
          <Toast status="critical">{this.props.error.message}</Toast>
        ) : null}
        <DepositHeader
          draftId={this.props.draft_id}
          saveData={this._actionHandler("save")}
          publishData={this._actionHandler("publish")}
          deleteDraft={this._actionHandler("delete")}
          discardData={this._actionHandler("discard")}
        />
        {this.props.actionsLayer ? (
          <Layer
            closer={true}
            align="center"
            flush={true}
            overlayClose={true}
            onClose={this.props.toggleActionsLayer}
          >
            <Box
              justify="center"
              flex={true}
              wrap={false}
              pad="medium"
              size="medium"
            >
              {this.renderMessage(this.state.actionType)}
              <Box direction="row" justify="center" align="center">
                <Box>
                  <Button
                    label="Yes"
                    primary={true}
                    onClick={() => this.renderAction(this.state.actionType)}
                  />
                </Box>
                <Box colorIndex="grey-4-a" margin="small">
                  <Button
                    label="Cancel"
                    onClick={() => this.props.toggleActionsLayer()}
                  />
                </Box>
              </Box>
            </Box>
          </Layer>
        ) : null}
        <Box direction="row" justify="between" flex={true} wrap={false}>
          <Sidebar draftId={this.props.draft_id} addAction={true} />
          {this.props.schema ? (
            <DepositForm
              formData={this.props.formData}
              schema={_schema}
              uiSchema={this.props.uiSchema || {}}
              onChange={change => {
                // console.log("CHANGE::",change);
                this.props.formDataChange(change.formData);
              }}
            />
          ) : null}
          <Previewer data={this.props.formData || {}} />
        </Box>
      </Box>
    );
  }
}

CreateDeposit.propTypes = {
  match: PropTypes.object,
  draft_id: PropTypes.string,
  getDraftById: PropTypes.func,
  initForm: PropTypes.func,
  fetchSchema: PropTypes.func,
  deleteDraft: PropTypes.func,
  publishDraft: PropTypes.func,
  discardDraft: PropTypes.func,
  updateDraft: PropTypes.func,
  createDraft: PropTypes.func,
  formDataChange: PropTypes.func,
  editPublished: PropTypes.func,
  draft: PropTypes.object,
  formData: PropTypes.object,
  toggleActionsLayer: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  error: PropTypes.bool,
  actionsLayer: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    schema: state.drafts.get("schema"),
    uiSchema: state.drafts.get("uiSchema"),
    error: state.drafts.getIn(["current_item", "error"]),
    draft_id: state.drafts.getIn(["current_item", "id"]),
    draft: state.drafts.getIn(["current_item", "data"]),
    published_id: state.drafts.getIn(["current_item", "published_id"]),
    formData: state.drafts.getIn(["current_item", "formData"]),
    actionsLayer: state.drafts.get("actionsLayer")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSchema: schema => dispatch(fetchSchema(schema)),
    createDraft: (data, schema) => dispatch(createDraft(data, schema)),
    updateDraft: (data, draft_id) => dispatch(updateDraft(data, draft_id)),
    getDraftById: (id, fet) => dispatch(getDraftById(id, fet)),
    initForm: () => dispatch(initForm()),
    publishDraft: draft_id => dispatch(publishDraft(draft_id)),
    deleteDraft: draft_id => dispatch(deleteDraft(draft_id)),
    discardDraft: draft_id => dispatch(discardDraft(draft_id)),
    editPublished: (data, schema, draft_id) =>
      dispatch(editPublished(data, schema, draft_id)),
    formDataChange: data => dispatch(formDataChange(data)),
    toggleActionsLayer: () => dispatch(toggleActionsLayer())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDeposit);
