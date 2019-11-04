import React from "react";
import PropTypes from "prop-types";

import _omit from "lodash/omit";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";
import FileList from "../drafts/components/FileList";

import JSONSchemaPreviewer from "../drafts/form/JSONSchemaPreviewer";
import SectionHeader from "../drafts/components/SectionHeader";
import { EditAnchor } from "../drafts/components/DraftActionsButtons";
import AnnounceIcon from "grommet/components/icons/base/Announce";

import RunsIndex from "../published/RunsIndex";
import { Route } from "react-router-dom";

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
  _discoverSchema = item => {
    let type;
    return item.$ana_type
      ? item.$ana_type
      : ((type = item.$schema.split("/")),
        type[type.length - 1].replace("-v0.0.1.json", ""));
  };

  render() {
    let { schema, uiSchema } = this.props.schemas
      ? this.props.schemas.toJS()
      : {};
    if (!(schema && uiSchema)) return null;

    let _schema = transformSchema(schema);

    // let status = item ? item._deposit.status : null;
    return (
      <Box flex={true}>
        <Box direction="row" flex={true} wrap={false}>
          <Sidebar full={false} size="medium" colorIndex="light-2">
            <SectionHeader label="Files | Data | Source Code" />
            <Box flex={true}>
              <FileList files={this.props.files} status={this.props.status} />
            </Box>
          </Sidebar>
          {this.props.schemas ? (
            <Box flex={true}>
              <SectionHeader
                label={
                  <Box
                    direction="row"
                    align="center"
                    pad={{ between: "small" }}
                  >
                    <Box>
                      {this.props.metadata && this.props.metadata.general_title}
                    </Box>
                    <Box
                      direction="row"
                      align="center"
                      pad={{ horizontal: "small", between: "small" }}
                      margin="none"
                      colorIndex="grey-3-a"
                    >
                      <span>{this.props.id}</span>
                    </Box>
                    <Box
                      direction="row"
                      align="center"
                      pad={{ horizontal: "small", between: "small" }}
                      margin="none"
                      colorIndex="neutral-4-a"
                    >
                      <span>Published</span> <AnnounceIcon size="xsmall" />
                    </Box>
                  </Box>
                }
                uppercase={false}
                action={this.props.canUpdate ? <EditAnchor draft_id={this.props.draft_id} /> : null}
              />
              <Box flex={true} direction="row" justify="between">
                <Box flex={false} pad="medium">
                  <JSONSchemaPreviewer
                    formData={this.props.metadata.toJS()}
                    schema={_schema}
                    uiSchema={{}}
                    onChange={() => {}}
                  >
                    <span />
                  </JSONSchemaPreviewer>
                </Box>
                <Route
                  exact
                  path={`/published/:id/runs/`}
                  component={RunsIndex}
                />
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

const mapStateToProps = state => {
  return {
    id: state.published.get("id"),
    draft_id: state.published.get("draft_id"),
    canUpdate: state.published.get("can_update"),
    metadata: state.published.get("metadata"),
    files: state.published.get("files"),
    schemas: state.published.get("schemas"),
    status: state.published.get("status")
  };
};

export default connect(mapStateToProps)(PublishedPreview);
