import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import cogoToast from "cogo-toast";
import { EditAnchor, Anchors } from "../drafts/components/Buttons";

import JSONSchemaPreviewer from "./form/JSONSchemaPreviewer";
import SectionBox from "../partials/SectionBox";

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

class DraftPreview extends React.Component {
  showToaster(error) {
    cogoToast.error(error, {
      hideAfter: 3
    });
  }

  render() {
    let _schema =
      this.props.schemas && this.props.schemas.schema
        ? transformSchema(this.props.schemas.schema)
        : null;

    return (
      <Box
        id="deposit-page"
        flex={true}
        pad="small"
        direction="row"
        wrap={true}
      >
        {this.props.error ? this.showToaster(this.props.error.message) : null}
        <Box
          flex={true}
          pad={{ between: "medium" }}
          direction="row"
          className="width-100"
        >
          <Box flex={true} size={{ width: { min: "medium" } }}>
            <SectionBox
              header="Metadata"
              headerActions={
                this.props.canUpdate ? (
                  <EditAnchor draft_id={this.props.draft_id} />
                ) : null
              }
              body={
                this.props.schemas && this.props.schemas.schema ? (
                  <Box flex={true} pad="small">
                    <JSONSchemaPreviewer
                      formData={this.props.formData} // TOFIX: change to get from metadata
                      schema={_schema}
                      uiSchema={this.props.schemas.uiSchema || {}}
                      onChange={() => {}}
                    >
                      <span />
                    </JSONSchemaPreviewer>
                  </Box>
                ) : null
              }
            />
          </Box>
          <Box flex={true} size={{ width: { min: "medium" } }}>
            <SectionBox
              header="Repositories"
              headerActions={
                <Anchors
                  draft_id={this.props.draft_id}
                  tab="integrations"
                  label={this.props.canUpdate ? "Manage" : "Show"}
                />
              }
              body={
                <Box pad="small">
                  <Box
                    key="header"
                    direction="row"
                    wrap={false}
                    justify="between"
                    pad={{ between: "small" }}
                    margin={{ bottom: "small" }}
                  >
                    <Box flex={false}>
                      <strong>Source</strong>
                    </Box>
                    <Box flex={true}>
                      <strong>Repository</strong>
                    </Box>
                    <Box flex={false}>
                      <strong>Branch/Ref</strong>
                    </Box>
                  </Box>
                  {this.props.repositories && this.props.repositories.length ? (
                    this.props.repositories.map((repo, index) => (
                      <Box
                        key={index}
                        direction="row"
                        wrap={false}
                        justify="between"
                        pad={{ between: "small" }}
                      >
                        <Box flex={false}>
                          {repo.host.indexOf("github") > -1
                            ? "Github"
                            : "Gitlab"}
                        </Box>
                        <Box flex={true}>
                          {repo.owner}/{repo.name}
                        </Box>
                        <Box flex={false}>{repo.branch}</Box>
                      </Box>
                    ))
                  ) : (
                    <Box>No repositories connected</Box>
                  )}
                </Box>
              }
            />
            <SectionBox
              header="Workflows"
              headerActions={
                <Anchors
                  draft_id={this.props.draft_id}
                  label={this.props.canUpdate ? "Manage" : "Show"}
                />
              }
              body={
                <Box pad="small">
                  <Box
                    key="header"
                    direction="row"
                    wrap={false}
                    justify="between"
                    pad={{ between: "small" }}
                    margin={{ bottom: "small" }}
                  >
                    <Box flex={false}>
                      <strong>Engine</strong>
                    </Box>
                    <Box flex={true}>
                      <strong>Workflow Name</strong>
                    </Box>
                    <Box flex={false}>
                      <strong>Status</strong>
                    </Box>
                  </Box>
                  {this.props.workflows && this.props.workflows.length ? (
                    this.props.workflows.map((workflow, index) => (
                      <Box
                        key={index}
                        direction="row"
                        wrap={false}
                        justify="between"
                        pad={{ between: "small" }}
                      >
                        <Box flex={false}>{workflow.engine}</Box>
                        <Box flex={true}>{workflow.name}</Box>
                        <Box flex={false}>{workflow.status}</Box>
                      </Box>
                    ))
                  ) : (
                    <Box>No workflows yet</Box>
                  )}
                </Box>
              }
            />
          </Box>
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
  canUpdate: PropTypes.bool,
  fetchAndAssignSchema: PropTypes.func,
  error: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schemas: state.draftItem.get("schemas"),
    // schemasLoading: state.draftItem.get("schemasLoading"),
    canUpdate: state.draftItem.get("can_update"),
    draft_id: state.draftItem.get("id"),
    repositories: state.draftItem.get("repositories"),
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
