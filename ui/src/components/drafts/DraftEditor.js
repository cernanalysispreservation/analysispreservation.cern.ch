import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, Toast } from "grommet";
import { Switch, Route } from "react-router-dom";

import { initForm, formDataChange } from "../../actions/drafts";

import { fetchAndAssignSchema } from "../../actions/common";

import DepositForm from "./form/Form";
import Sidebar from "./components/DepositSidebar";
import DraftJSONPreviewer from "./components/DraftJSONPreviewer";
import CreateDraftSidebar from "./components/CreateDraftSidebar";

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

class DraftEditor extends React.Component {
  constructor(props) {
    super(props);

    // Create the ref for the form
    // this.formRef = React.createRef();
  }

  componentDidMount() {
    // If "schema_id" from URL exists init form and fetch schema
    if (this.props.match.params.schema_id) {
      this.props.initForm();
      this.props.fetchAndAssignSchema(null, this.props.match.params.schema_id);
    }
  }

  componentDidUpdate() {
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
    let _schema =
      this.props.schemas && this.props.schemas.schema
        ? transformSchema(this.props.schemas.schema)
        : null;
    return (
      <Box id="deposit-page" flex={true}>
        {this.props.error ? (
          <Toast status="critical">{this.props.error.message}</Toast>
        ) : null}

        <Box direction="row" justify="between" flex={true} wrap={false}>
          <Route
            path="/drafts/create/:schema_id"
            render={ props => <CreateDraftSidebar {...props} ref={this.formRef}/> }
          />
          <Route path="/drafts/:draft_id/edit" component={Sidebar} />

          {this.props.schemas && this.props.schemas.schema ? (
            <DepositForm
              formRef={this.props.formRef}
              formData={this.props.formData}
              schema={_schema}
              uiSchema={this.props.schemas.uiSchema || {}}
              onChange={change => {
                this.props.formDataChange(change.formData);
              }}
              customValidation={true}
              validate={true}
              errors={this.props.error ? this.props.error.data.errors : []}
            />
          ) : null}

          <Route path="/drafts/:draft_id/edit" component={DraftJSONPreviewer} />
        </Box>
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
    error: state.drafts.getIn(["current_item", "error"])
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
