import React from "react";
import PropTypes from "prop-types";

import _omit from "lodash/omit";

import { connect } from "react-redux";

import { Box, Sidebar } from "grommet";

import { getPublishedItem } from "../../actions/published";
import FilesPublished from "./components/FilesPublished";

import JSONSchemaPreviewer from "../drafts/form/JSONSchemaPreviewer";
import SectionHeader from "../drafts/components/SectionHeader";
import Status from "grommet/components/icons/Status";

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

class PublishedPreview extends React.Component {
  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  render() {
    let item = this.props.item ? this.props.item.metadata : null;
    let _schema = this.props.schema ? transformSchema(this.props.schema) : null;
    let files = item ? item._files : null;
    return (
      <Box flex={true}>
        <Box direction="row" flex={true} wrap={false}>
          <Sidebar full={false} size="medium" colorIndex="light-2">
            <SectionHeader label="Files | Data | Source Code" />
            <Box flex={true}>
              <FilesPublished files={files} />
            </Box>
          </Sidebar>
          {_schema && this.props.uiSchema ? (
            <Box flex={true}>
              <SectionHeader label="Published" status={<Status value="ok" />} />
              <Box flex={true}>
                <Box flex={false} pad="medium">
                  <JSONSchemaPreviewer
                    formData={item || {}}
                    schema={_schema}
                    uiSchema={this.props.uiSchema || {}}
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

PublishedPreview.propTypes = {
  match: PropTypes.object,
  draft_id: PropTypes.string,
  schemas: PropTypes.object,
  schemaId: PropTypes.string,
  formData: PropTypes.object,
  schemasLoading: PropTypes.bool,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

function mapStateToProps(state) {
  return {
    item: state.published.getIn(["current_item", "data"]),
    schema: state.published.getIn(["current_item", "schema"]),
    uiSchema: state.published.getIn(["current_item", "uiSchema"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPublishedItem: id => dispatch(getPublishedItem(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PublishedPreview);
