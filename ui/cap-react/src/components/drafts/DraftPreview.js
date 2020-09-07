import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import cogoToast from "cogo-toast";

import Anchor from "../partials/Anchor";

import JSONSchemaPreviewer from "./form/JSONSchemaPreviewer";
import SectionBox from "../partials/SectionBox";
import Label from "grommet/components/Label";
import Edit from "grommet/components/icons/base/Edit";

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
    "control_number",
    "_review"
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

  getEditAnchor = () => {
    let comp = this.props.canUpdate ? (
      <Anchor
        primary
        pad={{ horizontal: "small" }}
        justify="end"
        path={`/drafts/${this.props.draft_id}/edit`}
        label={
          <Label size="small" uppercase>
            Edit
          </Label>
        }
        icon={<Edit size="xsmall" />}
      />
    ) : null;

    return comp;
  };

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
          <Box flex={true} size={{ width: { min: "medium" } }} basis="3/4">
            <SectionBox
              header="Metadata"
              headerActions={
                this.props.canUpdate ? (
                  <Anchor
                    pad={{ horizontal: "small" }}
                    justify="end"
                    path={`/drafts/${this.props.draft_id}/edit`}
                    label={"Edit"}
                  />
                ) : null
              }
              body={
                this.props.schemas && this.props.schemas.schema ? (
                  <Box flex={true} pad="small">
                    <JSONSchemaPreviewer
                      formData={this.props.metadata}
                      schema={_schema}
                      schemaType={this.props.schemaType}
                      uiSchema={this.props.schemas.uiSchema || {}}
                      onChange={() => {}}
                      editAnchor={this.getEditAnchor()}
                      draft={this.props.status === "draft"}
                    >
                      <span />
                    </JSONSchemaPreviewer>
                  </Box>
                ) : null
              }
            />
          </Box>
          <Box flex={true} size={{ width: { min: "medium" } }} basis="1/4">
            <SectionBox
              header="Repositories"
              headerActions={
                <Anchor
                  pad={{ horizontal: "small" }}
                  justify="end"
                  path={`/drafts/${this.props.draft_id}/integrations`}
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
                <Anchor
                  disabled
                  pad={{ horizontal: "small" }}
                  path={`/drafts/${this.props.draft_id}`}
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
  metadata: PropTypes.object,
  schemasLoading: PropTypes.bool,
  canUpdate: PropTypes.bool,
  fetchAndAssignSchema: PropTypes.func,
  error: PropTypes.object,
  workflows: PropTypes.array,
  repositories: PropTypes.array,
  schemaType: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schemas: state.draftItem.get("schemas"),
    schemaType: state.draftItem.get("schema"),
    // schemasLoading: state.draftItem.get("schemasLoading"),
    canUpdate: state.draftItem.get("can_update"),
    draft_id: state.draftItem.get("id"),
    repositories: state.draftItem.get("repositories"),
    metadata: state.draftItem.get("metadata"),
    status: state.draftItem.get("status")
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftPreview);
