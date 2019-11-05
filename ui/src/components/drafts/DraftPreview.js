import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import cogoToast from "cogo-toast";

import JSONSchemaPreviewer from "./form/JSONSchemaPreviewer";

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

class DraftPreview extends React.Component {
  showToaster(error) {
    cogoToast.error(error, {
      hideAfter: 0
    });
  }
  render() {
    let _schema =
      this.props.schemas && this.props.schemas.schema
        ? transformSchema(this.props.schemas.schema)
        : null;

    return (
      <Box id="deposit-page" flex={true}>
        {this.props.error ? this.showToaster(this.props.error.message) : null}

        <Box direction="row" flex={true} wrap={false}>
          {this.props.schemas && this.props.schemas.schema ? (
            <Box flex={true}>
              <Box flex={true}>
                <Box flex={false} pad="medium">
                  <JSONSchemaPreviewer
                    formData={this.props.formData} // TOFIX: change to get from metadata
                    schema={_schema}
                    uiSchema={this.props.schemas.uiSchema || {}}
                    onChange={() => {}}
                  >
                    <span />
                  </JSONSchemaPreviewer>
                </Box>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    );
  }
}

DraftPreview.propTypes = {
  match: PropTypes.object,
  draft_id: PropTypes.string,
  schemas: PropTypes.object,
  schemaId: PropTypes.string,
  formData: PropTypes.object,
  schemasLoading: PropTypes.bool,
  fetchAndAssignSchema: PropTypes.func,
  error: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schemas: state.draftItem.get("schemas"),
    // schemasLoading: state.draftItem.get("schemasLoading"),

    draft_id: state.draftItem.get("id"),
    formData: state.draftItem.get("formData") // TOFIX: remove to get from metadata
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPreview);
