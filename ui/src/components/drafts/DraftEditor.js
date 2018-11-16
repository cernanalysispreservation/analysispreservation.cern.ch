import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import { initForm, formDataChange } from "../../actions/drafts";

import { fetchAndAssignSchema } from "../../actions/common";

import DepositForm from "./form/Form";
import Sidebar from "./components/DepositSidebar";
import DraftJSONPreviewer from "./components/DraftJSONPreviewer";
import PermissionDenied from "../errors/403";

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
      this.props.fetchAndAssignSchema(null, this.props.match.params.schema_id);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.match.params.schema_id !== prevProps.match.params.schema_id
    ) {
      this.props.fetchAndAssignSchema(null, this.props.match.params.schema_id);
    }
    if (this.props.schemaId) {
      if (!this.props.schemasLoading) {
        if (
          this.props.schemas == null ||
          this.props.schemaId != this.props.schemas.schemaId
        ) {
          this.props.fetchAndAssignSchema(this.props.schemaId);
        }
      }
    }
  }

  render() {
    if (this.props.schemaError && this.props.schemaError.status == 403)
      return (
        <PermissionDenied
          status={this.props.schemaError.status}
          message={this.props.schemaError.message}
        />
      );

    let _schema =
      this.props.schemas && this.props.schemas.schema
        ? transformSchema(this.props.schemas.schema)
        : null;
    return (
      <Box id="deposit-page" flex={true}>
        {this.props.schemas &&
          this.props.schemas.schema && (
            <Box
              direction="row"
              justify="between"
              alignContent="end"
              flex={true}
              wrap={false}
            >
              <Sidebar />
              <DepositForm
                formRef={this.props.formRef}
                formData={this.props.formData || {}}
                schema={_schema}
                uiSchema={this.props.schemas.uiSchema || {}}
                onChange={change => {
                  this.props.formDataChange(change.formData);
                }}
                customValidation={true}
                validate={true}
                errors={this.props.error ? this.props.error.data.errors : []}
              />

              <DraftJSONPreviewer />
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
  schemaId: PropTypes.string,
  error: PropTypes.object,
  formData: PropTypes.object,
  draft_id: PropTypes.string,
  formDataChange: PropTypes.func,
  fetchAndAssignSchema: PropTypes.func
};

function mapStateToProps(state) {
  return {
    schemaId: state.drafts.getIn(["current_item", "schema"]),
    draft_id: state.drafts.getIn(["current_item", "id"]),
    schemasLoading: state.drafts.getIn(["current_item", "schemasLoading"]),
    formData: state.drafts.getIn(["current_item", "formData"]),
    schemas: state.drafts.getIn(["current_item", "schemas"]),
    error: state.drafts.getIn(["current_item", "error"]),
    schemaError: state.drafts.get("schemaError")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAndAssignSchema: (schemaURL, schemaID, schemaVersion) =>
      dispatch(fetchAndAssignSchema(schemaURL, schemaID, schemaVersion)),
    initForm: () => dispatch(initForm()),
    formDataChange: data => dispatch(formDataChange(data))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftEditor);
