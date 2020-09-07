import React from "react";
import PropTypes from "prop-types";

import _omit from "lodash/omit";
import axios from "axios";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Sidebar from "grommet/components/Sidebar";

import FileTree from "../drafts/components/FileTree";

import JSONSchemaPreviewer from "../drafts/form/JSONSchemaPreviewer";
import SectionHeader from "../drafts/components/SectionHeader";

import Anchor from "../partials/Anchor";
import Label from "grommet/components/Label";
import Edit from "grommet/components/icons/base/Edit";

import Tag from "../partials/Tag";

import RunsIndex from "../published/RunsIndex";
import { Route } from "react-router-dom";
import { ValidateIcon } from "grommet/components/icons/base";
import DepositReviewCreateLayer from "../drafts/components/DepositReviewCreateLayer";
import cogoToast from "cogo-toast";

import FormHeader from "../partials/FormHeader";

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
    this.state = {
      addReviewLayer: false
    };
  }

  toggleAddReview = () => {
    this.setState({
      addReviewLayer: !this.state.addReviewLayer,
      reviewError: null
    });
  };

  _addReview = review => {
    let uri = this.props.review_link;
    this.setState({ reviewError: null });
    axios
      .post(uri, review, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/form+json"
        }
      })
      .then(() => {
        cogoToast.success("Your review has been submitted", {
          position: "top-center",
          bar: { size: "0" },
          hideAfter: 3
        });

        this.setState({ reviewSuccess: true, addReviewLayer: false });
      })
      .catch(error => {
        this.setState({ reviewError: error.response.data });
      });
  };

  _discoverSchema = item => {
    let type;
    return item.$ana_type
      ? item.$ana_type
      : ((type = item.$schema.split("/")),
        type[type.length - 1].replace("-v0.0.1.json", ""));
  };

  getEditAnchor = () => {
    let comp = this.props.canUpdate ? (
      <Anchor
        pad={{ horizontal: "small" }}
        justify="end"
        primary
        path={`/drafts/${this.props.draft_id}/edit`}
        icon={<Edit size="xsmall" />}
        label={
          <Label size="small" uppercase>
            Edit
          </Label>
        }
      />
    ) : null;

    return comp;
  };

  getReviewAnchor = () => {
    let comp = this.props.canReview ? (
      <Anchor
        pad={{ horizontal: "small" }}
        justify="end"
        primary
        onClick={this.toggleAddReview}
        icon={<ValidateIcon size="xsmall" />}
        label={
          <Label size="small" uppercase>
            Review
          </Label>
        }
      />
    ) : null;

    return comp;
  };

  getTagsList = () => {
    return (
      <Box
        direction="row"
        align="center"
        pad={{ between: "small" }}
        margin={{ left: "medium" }}
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
      <Box flex={true}>
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
              {this.state.addReviewLayer && (
                <DepositReviewCreateLayer
                  addReview={this._addReview}
                  toggleAddReview={this.toggleAddReview}
                  reviewSuccess={this.state.reviewSuccess}
                  error={this.state.reviewError}
                />
              )}
              <FormHeader
                title={this.props.metadata.toJS().general_title}
                tags={this.getTagsList()}
                reviewAnchor={this.getReviewAnchor()}
                editAnchor={this.getEditAnchor()}
              />
              <Box flex={true} direction="row" justify="between">
                <Box flex={true}>
                  <JSONSchemaPreviewer
                    formData={this.props.metadata.toJS()}
                    schema={_schema}
                    schemaType={this.props.schemaType.toJS()}
                    uiSchema={uiSchema}
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
  uiSchema: PropTypes.object,
  files: PropTypes.object,
  metadata: PropTypes.object,
  id: PropTypes.string,
  status: PropTypes.string,
  canUpdate: PropTypes.bool,
  canReview: PropTypes.bool,
  review_link: PropTypes.string,
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
    review_link: state.published.getIn(["links", "review"]),
    status: state.published.get("status")
  };
};

export default connect(mapStateToProps)(PublishedPreview);
