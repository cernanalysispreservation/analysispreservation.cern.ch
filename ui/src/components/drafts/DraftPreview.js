import _ from "lodash";
import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, Toast } from "grommet";

import { fetchSchema, getDraftById } from "../../actions/drafts";

import JSONSchemaPreviewer from "./form/JSONSchemaPreviewer";
import DepositHeader from "./components/DepositHeader";
import Sidebar from "./components/DepositSidebar";

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

class DraftPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.match.params.draft_id) {
      if (this.props.match.params.draft_id !== this.props.draft_id) {
        this.props.getDraftById(this.props.match.params.draft_id, true);
      }
    }
  }

  render() {
    let _schema = this.props.schema ? transformSchema(this.props.schema) : null;
    return (
      <Box id="deposit-page" flex={true}>
        {this.props.error ? (
          <Toast status="critical">{this.props.error.message}</Toast>
        ) : null}
        <DepositHeader draftId={this.props.draft_id} />
        <Box direction="row" flex={true} wrap={false}>
          <Sidebar draftId={this.props.draft_id} />
          {this.props.schema ? (
            <Box flex={true}>
              <Box pad="medium" colorIndex="light-2" />
              <Box flex={true}>
                <Box flex={false} pad="medium">
                  <JSONSchemaPreviewer
                    formData={this.props.formData}
                    schema={_schema}
                    uiSchema={this.props.uiSchema || {}}
                    onChange={() => {
                      // console.log("CHANGE::",change);
                      // this.props.formDataChange(change.formData);
                    }}
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
  getDraftById: PropTypes.func,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  error: PropTypes.object,
  formData: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schema: state.drafts.get("schema"),
    uiSchema: state.drafts.get("uiSchema"),
    draft_id: state.drafts.getIn(["current_item", "id"]),
    draft: state.drafts.getIn(["current_item", "data"]),
    published_id: state.drafts.getIn(["current_item", "published_id"]),
    formData: state.drafts.getIn(["current_item", "formData"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSchema: schema => dispatch(fetchSchema(schema)),
    getDraftById: (id, fet) => dispatch(getDraftById(id, fet))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPreview);
