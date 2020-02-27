import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Box from "grommet/components/Box";

import {
  initForm,
  formDataChange,
  clearErrorSuccess
} from "../../actions/draftItem";

import { fetchSchemaByNameVersion } from "../../actions/common";

import Form from "./form/Form";
import DraftJSONPreviewer from "./components/DraftJSONPreviewer";
import PermissionDenied from "../errors/403";
import DraftEditorHeader from "./components/DraftEditorHeader";

export const transformSchema = schema => {
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
    "_fetched_from",
    "_user_edited",
    "control_number"
  ];

  schema.properties = _omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies
  };

  return schema;
};

class DraftEditor extends React.Component {
  componentDidMount() {
    // If "schema_id" from URL exists init form and fetch schema
    if (this.props.match.params.schema_id) {
      this.props.initForm();
      this.props.fetchSchemaByNameVersion(this.props.match.params.schema_id);
      // this.props.fetchAndAssignSchema(null, this.props.match.params.schema_id);
    }
  }

  // componentDidUpdate(prevProps) {
  // if (
  //   this.props.match.params.schema_id !== prevProps.match.params.schema_id
  // ) {
  //   this.props.fetchAndAssignSchema(null, this.props.match.params.schema_id);
  // }
  // if (this.props.schemaId) {
  //   if (!this.props.schemasLoading) {
  //     if (
  //       this.props.schemas == null ||
  //       this.props.schemaId != this.props.schemas.schemaId
  //     ) {
  //       this.props.fetchAndAssignSchema(this.props.schemaId);
  //     }
  //   }
  // }
  // }

  render() {
    if (this.props.schemaErrors.length > 0) {
      return (
        <PermissionDenied
          status={this.props.schemaErrors[0].status}
          message={this.props.schemaErrors[0].message}
          statusText={this.props.schemaErrors[0].statusText}
        />
      );
    }

    let _schema =
      this.props.schemas && this.props.schemas.schema
        ? transformSchema(this.props.schemas.schema)
        : null;

    return (
      <Box id="deposit-page" flex={true}>
        {this.props.schemas &&
          this.props.schemas.schema && (
            <Box flex={true}>
              {this.props.canUpdate && (
                <Box flex={false} separator="bottom" style={{ padding: "5px" }}>
                  <DraftEditorHeader formRef={this.props.formRef} />
                </Box>
              )}
              <Box
                direction="row"
                justify="between"
                alignContent="end"
                flex={true}
                wrap={false}
              >
                <Form
                  formRef={this.props.formRef}
                  formData={this.props.formData || {}}
                  schema={_schema}
                  uiSchema={this.props.schemas.uiSchema || {}}
                  onChange={change => {
                    this.props.formDataChange(change.formData);
                  }}
                  errors={this.props.errors}
                />
                <DraftJSONPreviewer />
              </Box>
            </Box>
          )}
      </Box>
    );
  }
}

DraftEditor.propTypes = {
  match: PropTypes.object,
  initForm: PropTypes.func,
  schemas: PropTypes.object,
  schemasLoading: PropTypes.bool,
  schemaErrors: PropTypes.array,
  // schemaId: PropTypes.string,
  error: PropTypes.object,
  formData: PropTypes.object,
  draft_id: PropTypes.string,
  formDataChange: PropTypes.func,
  fetchAndAssignSchema: PropTypes.func,
  fetchSchemaByNameVersion: PropTypes.func,
  formRef: PropTypes.object,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  canUpdate: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    all: state.draftItem.toJS(),
    schemaId: state.draftItem.get("schema"),
    draft_id: state.draftItem.get("id"),
    // schemasLoading: state.draftItem.getIn(["current_item", "schemasLoading"]),
    schemas: state.draftItem.get("schemas"),
    metadata: state.draftItem.get("metadata"),
    formData: state.draftItem.get("formData"),
    errors: state.draftItem.get("errors"),
    schemaErrors: state.draftItem.get("schemaErrors"),
    canUpdate: state.draftItem.get("can_update")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSchemaByNameVersion: name => dispatch(fetchSchemaByNameVersion(name)),
    initForm: () => dispatch(initForm()),
    formDataChange: data => dispatch(formDataChange(data)),
    clearErrorSuccess: () => dispatch(clearErrorSuccess())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftEditor)
);
