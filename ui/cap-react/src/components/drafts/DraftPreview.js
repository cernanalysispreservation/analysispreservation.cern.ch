import _omit from "lodash/omit";

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import cogoToast from "cogo-toast";
import { EditAnchor } from "../drafts/components/Buttons";

import SectionBox from "../partials/SectionBox";
import InfoHeaderBox from "../partials/InfoHeaderBox";
import InfoArrayBox from "../partials/InfoArrayBox";
import DraftSchemaProgress from "./components/DraftSchemaProgress";
import PermissionBox from "../partials/PermissionBox";

import { BsCodeSlash } from "react-icons/bs";
import { MdAttachFile } from "react-icons/md";

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

const calculateCollaborators = access => {
  if (!access) return "-";

  const adminUsers = access["deposit-admin"].users;
  const readUsers = access["deposit-read"].users;
  const updateUsers = access["deposit-update"].users;
  const allEmails = [...new Set([...adminUsers, ...readUsers, ...updateUsers])];

  return allEmails.length;
};

class DraftPreview extends React.Component {
  showToaster(error) {
    cogoToast.error(error, {
      hideAfter: 3
    });
  }

  render() {
    let infoData = [
      {
        title: "revision",
        number: this.props.revision,
        type: "info"
      },
      {
        title: "collaborators",
        number: calculateCollaborators(this.props.access),
        type: "collaboration"
      },
      {
        title: "repositories",
        number: this.props.webhooks && this.props.webhooks.length,
        type: "code"
      },
      {
        title: "files",
        number:
          this.props.files && Object.entries(this.props.files.toJS()).length,
        type: "file"
      },
      {
        title: "schema version",
        number: this.props.schema ? this.props.schema.version : "-",
        type: "info"
      }
    ];
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
        colorIndex="light-2"
        justify="center"
      >
        {this.props.error ? this.showToaster(this.props.error.message) : null}
        <Box
          flex={true}
          pad={{ between: "medium" }}
          direction="column"
          style={{ width: "100%", maxWidth: "1200px" }}
        >
          <Box pad={{ horizontal: "medium" }}>
            <Box
              direction="row"
              // justify="between"
              responsive={false}
              align="center"
              colorIndex="light-1"
            >
              {infoData.map((item, index) => (
                <Box key={index} colorIndex="light-1">
                  <InfoHeaderBox {...item} />
                </Box>
              ))}
            </Box>
          </Box>
          <Box pad={{ horizontal: "medium" }}>
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
                    <DraftSchemaProgress
                      metadata={this.props.metadata}
                      schema={_schema}
                      uiSchema={this.props.schemas.uiSchema || {}}
                      draft_id={this.props.match.params.draft_id}
                    />
                  </Box>
                ) : null
              }
            />
          </Box>

          <Box pad={{ horizontal: "medium" }}>
            <SectionBox
              header="Connected Repositories"
              headerActions={null}
              body={
                this.props.webhooks && this.props.webhooks.length > 0 ? (
                  <Box flex={true} pad="small">
                    <InfoArrayBox
                      items={this.props.webhooks}
                      type="repositories"
                    />
                  </Box>
                ) : (
                  <Box align="center">
                    <Box
                      colorIndex="light-2"
                      style={{ borderRadius: "50%" }}
                      pad="small"
                    >
                      <BsCodeSlash size={25} />
                    </Box>
                    <Box pad="small">No connected repositories yet</Box>
                  </Box>
                )
              }
            />
          </Box>

          <Box pad={{ horizontal: "medium" }}>
            <SectionBox
              header="Uploaded Files & Repositories"
              headerActions={null}
              body={
                this.props.files &&
                Object.entries(this.props.files.toJS()).length > 0 ? (
                  <Box flex={true} pad="small">
                    <InfoArrayBox
                      type="files"
                      items={Object.entries(this.props.files.toJS())}
                    />
                  </Box>
                ) : (
                  <Box align="center">
                    <Box
                      colorIndex="light-2"
                      style={{ borderRadius: "50%" }}
                      pad="small"
                    >
                      <MdAttachFile size={25} />
                    </Box>
                    <Box pad="small">No uploaded files/repositories yet</Box>
                  </Box>
                )
              }
            />
          </Box>

          <Box pad={{ horizontal: "medium" }}>
            <SectionBox
              header="Collaborators"
              headerActions={null}
              body={
                this.props.access ? (
                  <Box flex={true} pad="small">
                    <PermissionBox access={this.props.access} />
                  </Box>
                ) : (
                  <Box align="center">
                    <Box pad="small">There are no collaborators yet.</Box>
                  </Box>
                )
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
  schemasLoading: PropTypes.bool,
  canUpdate: PropTypes.bool,
  fetchAndAssignSchema: PropTypes.func,
  error: PropTypes.object,
  workflows: PropTypes.array,
  repositories: PropTypes.array,
  webhooks: PropTypes.array,
  revision: PropTypes.string,
  access: PropTypes.object,
  files: PropTypes.object,
  schema: PropTypes.object,
  emptyPreviewFields: PropTypes.func,
  metadata: PropTypes.object
};

function mapStateToProps(state) {
  return {
    schemas: state.draftItem.get("schemas"),
    access: state.draftItem.get("access"),
    schema: state.draftItem.get("schema"),
    // schemasLoading: state.draftItem.get("schemasLoading"),
    canUpdate: state.draftItem.get("can_update"),
    draft_id: state.draftItem.get("id"),
    repositories: state.draftItem.get("repositories"),
    webhooks: state.draftItem.get("webhooks"),
    files: state.draftItem.get("bucket"),
    revision: state.draftItem.get("revision"),
    metadata: state.draftItem.get("metadata")
  };
}

export default connect(
  mapStateToProps,
  null
)(DraftPreview);
