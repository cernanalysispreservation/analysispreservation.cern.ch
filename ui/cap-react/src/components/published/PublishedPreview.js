import React from "react";
import PropTypes from "prop-types";

import _omit from "lodash/omit";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";

import FileTree from "../drafts/components/FileTree";

import JSONSchemaPreviewer from "../drafts/form/JSONSchemaPreviewer";
import SectionHeader from "../drafts/components/SectionHeader";

import Tag from "../partials/Tag";

import RunsIndex from "../published/RunsIndex";
import { Route } from "react-router-dom";

import FormHeader from "../partials/FormHeader";
import Button from "../partials/Button";
import Review from "../partials/Review/ReviewModal";
import { AiOutlineTag } from "react-icons/ai";

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

class PublishedPreview extends React.Component {
  constructor(props) {
    super(props);
  }

  _discoverSchema = item => {
    let type;
    return item.$ana_type
      ? item.$ana_type
      : ((type = item.$schema.split("/")),
        type[type.length - 1].replace("-v0.0.1.json", ""));
  };

  getTagsList = () => {
    return (
      <Box
        direction="row"
        align="center"
        pad={{ between: "small" }}
        responsive={false}
      >
        <Tag
          text="Published"
          color={{
            bgcolor: "#f9f0ff",
            border: "rgba(146,109,146,1)",
            color: "rgba(146,109,146,1)"
          }}
        />
        <Tag text={this.props.id} />
        {this.props.schemaType && (
          <Tag
            text={`${this.props.schemaType.get(
              "fullname"
            )} v${this.props.schemaType.get("version")}`}
          />
        )}
      </Box>
    );
  };

  render() {
    let { schema, uiSchema } = this.props.schemas
      ? this.props.schemas.toJS()
      : {};
    if (!(schema && uiSchema)) return null;

    let _schema = transformSchema(schema);

    // let status = item ? item._deposit.status : null;
    return (
      <Box
        flex={true}
        style={{ position: "relative" }}
        id="published-preview-page"
      >
        <Box direction="row" flex={true}>
          <Sidebar full={false} size="medium" colorIndex="light-2">
            <SectionHeader label="Files | Data | Source Code" />
            <Box flex={true}>
              <FileTree
                files={this.props.files.toJS()}
                status={this.props.status}
                background="#f5f5f5"
                color="#000"
              />
            </Box>
          </Sidebar>
          {this.props.schemas ? (
            <Box flex={true}>
              <FormHeader
                title={this.props.metadata.toJS().general_title}
                tags={this.getTagsList()}
                reviewAnchor={
                  this.props.canReview && <Review isReviewingPublished />
                }
                editAnchor={
                  this.props.canUpdate && (
                    <Button
                      text="Edit"
                      margin="0 10px"
                      icon={<AiOutlineTag />}
                      onClick={() =>
                        this.props.history.push(
                          `/drafts/${this.props.draft_id}/edit`
                        )
                      }
                    />
                  )
                }
              />
              <Box flex={true} direction="row" justify="between">
                <Box flex={true}>
                  <JSONSchemaPreviewer
                    formData={this.props.metadata.toJS()}
                    schema={_schema}
                    schemaType={this.props.schemaType.toJS()}
                    uiSchema={uiSchema}
                    onChange={() => {}}
                    isPublished
                    displayViewButtons
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
  draft_id: PropTypes.string,
  schemas: PropTypes.object,
  item: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  files: PropTypes.object,
  metadata: PropTypes.object,
  id: PropTypes.string,
  status: PropTypes.string,
  canUpdate: PropTypes.bool,
  canReview: PropTypes.bool,
  schemaType: PropTypes.object
};

const mapStateToProps = state => {
  return {
    id: state.published.get("id"),
    draft_id: state.published.get("draft_id"),
    canUpdate: state.published.get("can_update"),
    canReview: state.published.get("can_review"),
    metadata: state.published.get("metadata"),
    files: state.published.get("files"),
    schemas: state.published.get("schemas"),
    schemaType: state.published.get("schema"),
    status: state.published.get("status")
  };
};

export default connect(mapStateToProps)(PublishedPreview);
